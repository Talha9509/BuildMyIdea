import { prismaClient } from '@repo/db/client'
import { Request, Response } from 'express'
import { razorpay } from '../config/razorpay.js'
import { onboardDevSchema } from '@repo/common/types'
import { payoutQueue } from "@repo/redis/client";

export const onboardDev = async (req: Request, res: Response) => {
  const userId = req.userId;
  const body = req.body;

  if (typeof userId !== 'number') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validated = onboardDevSchema.safeParse(body);
  if (!validated.success) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const isDev = await prismaClient.dev.findUnique({
      where: { userId: userId }
    })
    if(!isDev) return res.status(400).json({ message: "You are not a Developer" })
      
    const account = await razorpay.accounts.create({
      type: "route",
      email: validated.data.email,
      contact_name: validated.data.contact_name,
      phone: validated.data.phone,
      legal_business_name: validated.data.legal_business_name,
      customer_facing_business_name: validated.data.customer_facing_business_name ,
      business_type: 'individual',
      profile: {
        category: 'it_and_software',
        subcategory: 'saas',
        addresses: {
          registered:{
            street1: validated.data.street1,
            street2: validated.data.street2,
            city: validated.data.city,
            state: validated.data.state,
            postal_code: validated.data.postal_code,
            country: "IN"
         }
        }
      }
    });
    console.log(account)
    console.log(JSON.stringify(account))

    await prismaClient.dev.update({
      where: { userId: userId },
      data: { razorpayAccountId: account.id },
    });

    res.json({ success: true, accountId: account.id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to link bank account" });
  }
};

export const Payout = async (req: Request, res: Response) => {
  // return res.status(501).json({ message: "This feature is not added yet and is currently in progress" })
  const userId = Number(req.userId);
  const submitId = parseInt(req.params.submitId as string)
  const projectId = parseInt(req.params.projectId as string)

  if (typeof userId !== 'number') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [ownersProject, submitExists] = await Promise.all([
      prismaClient.project.findUnique({ where: { id: projectId, owner: { userId: userId } }, select: { paymentStatus: true, bounty: true, ownerId: true } }),
      prismaClient.submit.findUnique({ 
        where: { id: submitId, projectId: projectId }, 
        include: { 
          contributors: { 
            include: { 
              dev: {
                include: { user: {
                  select: { name: true }
                }}
              }  }
          }} 
        })
    ])

    if (!ownersProject) return res.status(400).json({ message: "You are not the Owner of the Project" })
    if (ownersProject.paymentStatus != "Paid") return res.status(400).json({ message: "You did not chose bounty for this project" })
    if (!submitExists) return res.status(404).json({ message: "Submission not found" })

    const missingAccountId = submitExists.contributors.find((contributor) => !contributor.dev.razorpayAccountId)
    if(missingAccountId) return res.status(400).json({ message: `Cannot payout. ${missingAccountId.dev.user.name} has not linked their bank account` })

    const totalPercentage = submitExists.contributors.reduce((sum, contribution) => sum + contribution.contributionPercent, 0)
    if(totalPercentage != 100) return res.status(400).json({ message: "Team contribution percentages not equal to 100%" })

  // here in update project, paymentstatus shouldnt be completed, only lock the winnerSubmitId 
    const updateProject = await prismaClient.project.update({
      where: { id: projectId },
      data: { winnerSubmitId: submitId }
    })

    console.log(updateProject)

    // Make the payment queue
    // also check if deposit is sucess?
    // take paymentid from payments table and send to worker
    await payoutQueue.add("payouts", {
      projectId: projectId,
      winnerSubmitId: submitId,
      bounty: ownersProject.bounty,
      ownerId: ownersProject.ownerId,
      contributors: submitExists.contributors.map((contributor) => ({
        devId: contributor.devId,
        contributionPercent: contributor.contributionPercent,
        razorpayAccountId: contributor.dev.razorpayAccountId
      }))
    }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 5 * 60 * 100 }
    })

    return res.json({ message: "The bounty to each contributor will be paid within 24 hours" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Failed to link bank account" });
  }
};