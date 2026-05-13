import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { submitSchema, updateSubmitSchema } from "@repo/common/types";

export const createSubmit = async (req: Request, res: Response) => {
  // the dev will post the code repo link of github
    const userId = req.userId
    const projectId = parseInt(req.params.id as string)
  
    if (typeof userId != 'number') {
      return res.status(401).json({ message: "Unauthorized" })
    }
    console.log(userId)
  
    const validated = submitSchema.safeParse(req.body)
    console.log(validated)
    if (!validated.success) {
      return res.status(400).json({ message: "Invalid Inputs" })
    }
  
    try {
      const [dev,project]=await Promise.all([
        prismaClient.dev.findUnique({ where: { userId: userId } }),
        prismaClient.project.findUnique({ where: { id: projectId } })
      ])
      console.log(dev)
      if (!dev) {
        return res.status(403).json({ message: "Only Developers are allowed for Submissions" })
      }
      if (!project) {
        return res.status(404).json({ message: "Project Not Found" })
      }
  
      const submit = await prismaClient.submit.create({
        data: {
          repoLink: validated.data.repoLink,
          liveLink: validated.data.liveLink,
          devId: dev.id,
          projectId: projectId
        }
      })
      if (!submit) {
        return res.status(409).json({ mesage: "Submission already exists" })
      }
      return res.status(201).json({ message: "Done", submit })
    } catch (error:any) {
      if(error.code==='P2002'){
        console.log("meta "+JSON.stringify(error.meta))
  
        const cause=error.meta.driverAdapterError.cause
        console.log(cause)
  
        if(cause.originalMessage.includes('projectId') && cause.originalMessage.includes('devId')){
          return res.status(409).json({ message: "You already submitted to this project" })
        }
        if(cause.originalMessage.includes('repoLink')){
          return res.status(403).json({ message: "Repo Link can't be same" })
        }
      }
      console.log(error)
      return res.status(500).json({ message: "Internal server Error" })
    }
};

export const updateSubmit = async (req: Request, res: Response) => {
  // the dev wants to make some changes in the submission of  code repo link of github
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)

  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthoized" })
  }
  console.log(userId)

  const validated = updateSubmitSchema.safeParse(req.body)
  console.log(validated)
  if (!validated.success) {
    return res.status(400).json({ message: "Invalid Inputs" })
  }

  if (Object.keys(validated.data).length === 0) {
    return res.status(400).json({ message: "Nothing to be changed" })
  }

  try {
    const dev = await prismaClient.dev.findUnique({
      where: { userId: userId }
    })
    if (!dev) {
      return res.status(403).json({ message: "Idea Creators not allowed to Edit" })
    }

    const submit = await prismaClient.submit.update({
      where: { id: submitId, devId: dev.id },
      data: validated.data
    })
    if (!submit) {
      res.status(403).json({ message: "Not Allowed to Edit others Submission" })
    }
    // either submission dont exist or you are not the owner of submission
    return res.json({ message: "Done", submit })
  } catch (error:any) {
    if(error.code==='P2002'){
      return res.status(403).json({ message: "Repo Link can't be same" })
    }
    console.log(error)
    return res.status(500).json({ message: "Internal server Error" })
  }
};

export const deleteSubmit = async (req: Request, res: Response) => {
  // the dev wants to delete the posted code repo link of github
  // check if user is dev. then delete submit from submit. then delete submit from projects
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)

  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log(userId)
  try {
    const dev = await prismaClient.dev.findUnique({
      where: { userId: userId }
    })
    if (!dev) {
      return res.status(403).json({ message: "Idea Creators not allowed to Delete" })
    }
    const submit = await prismaClient.submit.delete({
      where: { id: submitId, devId: dev.id }
    })
    if (!submit) {
      res.status(404).json({ message: "Not Allowed to Delete others Submission" })
    }
    return res.json({ message: "Done", submit })
  } catch (error: any) {
    if(error.code=='P2003'){
      return res.status(409).json({ message: "Can't Delete a Submission with Stars" })
    }
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
};