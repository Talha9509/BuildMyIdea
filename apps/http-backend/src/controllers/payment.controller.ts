import { prismaClient } from '@repo/db/client'
import { Request, Response } from 'express'
import { razorpay } from '../config/razorpay.js'
import { onboardDevSchema } from '@repo/common/types'

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
      business_type: 'individual',
      profile: {
        category: 'IT',
        subcategory: 'Software'
      }
    });

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
  const ownerId = req.userId;
  const submitId = parseInt(req.params.submitId as string)
  const projectId = parseInt(req.params.projectId as string)

  if (typeof ownerId !== 'number') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [ownersProject, submitExists] = await Promise.all([
      prismaClient.project.findUnique({ where: { id: projectId, ownerId: ownerId }, select: { paymentStatus: true } }),
      await prismaClient.submit.findUnique({ 
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

    submitExists.contributors.forEach((contributor) => {
      const devRazorpay = contributor.dev.razorpayAccountId
      if(!devRazorpay) return res.status(400).json({ message: `Dev ${contributor.dev.user.name} has no bank account` })
    })

    const updateProject = await prismaClient.project.update({
      where: { id: projectId },
      data: { paymentStatus: "Completed", winnerSubmitId: submitId }
    })

    // update project paymentstatus, winnersubmitId
    // make payments to each dev
    // create payment table row of payout 

    // Make the payment queue

    res.json({ message: "The bounty to each contributor will be paid within 24 hours" });
  } catch (error) {
    res.status(500).json({ error: "Failed to link bank account" });
  }
};