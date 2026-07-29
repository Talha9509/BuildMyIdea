import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { ProjectSchema, updateProjectSchema, searchQuerySchema } from '@repo/common/types'
import { googleAi } from '@repo/embedding/embedding'
import { embeddingQueue } from "@repo/redis/client";
import { razorpay } from '../config/razorpay.js'

export const createProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  const body = req.body;

  if (typeof userId !== 'number') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validated = ProjectSchema.safeParse(body);
  if (!validated.success) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  console.log(validated.data)
  console.log(JSON.stringify(validated.data))

  try {
    let project: any;
    let order: any;
    let amount: number | undefined;
    if (validated.data.compensationType == "equity") {
      project = await prismaClient.project.create({
        data: {
          name: validated.data.name,
          description: validated.data.description,
          skillsreq: validated.data.skillsreq,
          refrenceLink: validated.data.refrenceLink,
          mainFeature: validated.data.mainFeature,
          equity: validated.data.equity,
          owner: {
            connect: { userId: userId }
          }
        }
      });
    }

    else if (validated.data.compensationType == "bounty") {
      // return res.status(501).json({ message: "This feature is not added yet and is currently in progress, you can chose Equity" })
      const bountyInPaise = validated.data.bounty! * 100
      amount = validated.data.compensationType == "bounty" ? bountyInPaise : undefined
      project = await prismaClient.project.create({
        data: {
          name: validated.data.name,
          description: validated.data.description,
          skillsreq: validated.data.skillsreq,
          refrenceLink: validated.data.refrenceLink,
          mainFeature: validated.data.mainFeature,
          bounty: bountyInPaise,
          owner: {
            connect: { userId: userId }
          }
        }
      });

      order = await razorpay.orders.create({
        amount: bountyInPaise,
        currency: "INR",
        receipt: `receipt_project_${project.id}`
      })
      console.log("order " + order)
      console.log("order " + JSON.stringify(order))

      await prismaClient.payments.create({
        data: {
          projectId: project.id,
          ownerId: userId,
          paymentType: "Deposit",
          razorpayOrderId: order.id,
          status: "Processing"
        }
      })
    } else {
      return res.status(400).json({ message: "Invalid Compensation" });
    }

    const inputforAi = `Name is ${validated.data.name} and Description is ${validated.data.description} and Main Features is ${validated.data.mainFeature} ${validated.data.refrenceLink && `and Refrence Link is ${validated.data.refrenceLink}`} ${validated.data.skillsreq && `and the skills required are ${validated.data.skillsreq}`}`

    await embeddingQueue.add('generate-embeddings', {
      projectId: project.id,
      inputforAi: inputforAi
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 }
    })

    return res.status(201).json({ message: "Done", type: validated.data.compensationType, 
      // orderId: validated.data.compensationType == "bounty" ? order.id : undefined, 
      project: project, amount: amount });

  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: "Project Already Exists" });
    }
    if (err.code === 'P2025') {
      return res.status(403).json({ message: "Only Idea Creator can Add Project" });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await prismaClient.project.findMany({
    relationLoadStrategy: 'join',
    // where: {
    //   OR: [
    //     { paymentStatus: "Paid" },
    //     { bounty: { not: null } }
    //   ]
    // },
    select: {
      name: true, description: true, id: true, mainFeature: true, equity: true, bounty: true,
      owner: {
        select: {
          user: {
            select: { name: true }
          }
        }
      },
      submits: {
        select: {
          contributors: {
            select: {
              dev: {
                select: {
                  user: {
                    select: { name: true }
                  }
                }
              }
            }
          }
        }
      }
    },
  })
  return res.json({ projects: projects })
}

export const updateProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  const body = req.body
  const id = parseInt(req.params.id as string)
  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const validated = updateProjectSchema.safeParse(body)
  if (!validated.success) {
    return res.status(400).json({ message: "Invalid Inputs" })
  }

  if (Object.keys(validated.data).length === 0) {
    return res.status(400).json({ message: "Nothing to be changed" })
  }

  try {
    const owner = await prismaClient.owner.findFirst({
      where: {
        userId: userId, projects: {
          some: { id: id }
        }
      },
      select: {
        projects: {
          where: { id: id },
          select: { id: true }
        }
      }
    })
    console.log(owner?.projects)
    if (!owner) {
      return res.status(403).json({ message: "Not Allowed to edit others project" })
    }
    const project = await prismaClient.project.update({
      where: { id: id },
      data: validated.data,
    })

    const inputforAi = `Name is ${validated.data.name} and Description is ${validated.data.description} and Main Features is ${validated.data.mainFeature} ${validated.data.refrenceLink && `and Refrence Link is ${validated.data.refrenceLink}`} ${validated.data.skillsreq && `and the skills required are ${validated.data.skillsreq}`}`
    console.log(inputforAi)

    await embeddingQueue.add('generate-embeddings', {
      projectId: project.id,
      inputforAi: inputforAi
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 }
    })

    console.log("project: ", project)
    return res.json({ message: "Done", project: project })
  }
  catch (err: any) {
    if (err.code === "P2002") {
      console.log(err)
      return res.status(409).json({ message: "Project Already Exists" })
    }
    if (err.code === "P2025") {
      console.log(err)
      return res.status(404).json({ message: "Project Not Found" })
    }
    console.log(err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  const userId = req.userId
  const id = parseInt(req.params.id as string)

  try {
    const owner = await prismaClient.owner.findFirst({
      where: {
        userId: userId, projects: {
          some: { id: id }
        }
      },
      select: {
        projects: {
          where: { id: id },
          select: { id: true }
        }
      }
    })
    console.log(owner)
    console.log(owner?.projects)
    if (!owner) {
      return res.status(403).json({ message: "Not Allowed to Delete others Project" })
    }
    const deleted = await prismaClient.project.delete({
      where: { id: id }
    })
    if (!deleted) {
      return res.status(409).json({ message: "Can't Delete a Project with Active Submissions" })
    }
    return res.status(200).json({ message: "Done", deleted })
  } catch (error: any) {
    if (error.code == 'P2002') {
      return res.status(409).json({ message: "Can't Delete a Project with Active Submissions" })
    }
    if (error.code == 'P2003') {
      return res.status(409).json({ message: "Can't Delete a Project with Bounty" })
    }
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProjectbyId = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string)
  const userId = req.userId
  console.log(id)

  const project = await prismaClient.project.findUnique({
    relationLoadStrategy: 'join',
    where: { id: id },
    select: {
      id: true, name: true, description: true, skillsreq: true, refrenceLink: true, mainFeature: true,
      owner: {
        select: {
          user: {
            select: { name: true, id: true }
          }
        }
      },
      submits: {
        select: {
          liveLink: true, repoLink: true, id: true,
          // here we are counting stars related to this submission
          _count: {
            select: { stars: true },
          },
          stars: {
            where: { userId: userId }
          },
          contributors: {
            select: {
              contributionPercent: true, contributionRole: true,
              dev: {
                select: {
                  user: {
                    select: { name: true, id: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  if (!project) {
    return res.status(404).json({ message: "Project Not Found" })
  }
  return res.json({ message: "Done", project })
}

export const getProjectbySearch = async (req: Request, res: Response) => {
  const query = req.query.search

  // const validated = searchQuerySchema.safeParse(query)
  // if(!validated.success){
  //   return res.status(422).json({ message: "Invalid Inputs" })
  // }

  try {
    console.log(query)
    console.log("sending api request")
    const aiResponse = await googleAi.models.embedContent({
      model: 'gemini-embedding-2',
      contents: query as string,
      config: {
        outputDimensionality: 1536
      }
    })
    // const aiReponse = openai.embeddings.create({
    //   model: 'text-embedding-3-small',
    //   input: query as string
    // })
    if(!aiResponse.embeddings || !aiResponse.embeddings[0]?.values) return res.status(400).json({ message: "Enter  Project Names" })
    console.log(aiResponse.embeddings[0]?.values)
    const searchVector = `[${aiResponse.embeddings[0]?.values.join(",")}]`

    const matchingprojects = await prismaClient.$queryRaw`
      SELECT id, name, description, "mainFeature"
        FROM "Project"
        ORDER BY embedding <-> ${searchVector}::vector
        LIMIT 5;
    `
    console.log(matchingprojects)

    return res.json(matchingprojects)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
