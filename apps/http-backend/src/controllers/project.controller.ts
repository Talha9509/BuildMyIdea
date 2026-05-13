import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { ProjectSchema, updateProjectSchema } from "@repo/common/types";

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

  try {
    const project = await prismaClient.project.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        skillsreq: validated.data.skillsreq,
        refrenceLink: validated.data.refrenceLink,
        mainFeature: validated.data.mainFeature,
        owner: {
          connect: { userId: userId } 
        }
      }
    });

    return res.status(201).json({ message: "Done", project });

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

export const getProjects = async( req:Request, res: Response) => {
    console.log(process.env.DATABASE_URL)
  const projects = await prismaClient.project.findMany({
    relationLoadStrategy: 'join',
    select: {
      name: true, description: true, id: true, mainFeature:true, 
      owner: {
        select: {
          user: {
            select: { name: true }
          }
        }
      },
      submits: {
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
    },
  })
  return res.json({ projects:projects })
}

export const updateProject = async( req:Request, res: Response) => {
    // to edit a project by owner
      const userId = req.userId;
      const body = req.body
      const id = parseInt(req.params.id as string)
      if (typeof userId != 'number') {
        return res.status(401).json({ message: "Unauthorized" })
      }
      console.log(userId)
    
      const validated = updateProjectSchema.safeParse(body)
      console.log(validated)
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

export const deleteProject = async( req:Request, res: Response) => {
     // delte a project if owner wants to delete it
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
    where: { id: id, submits:{
      none:{}
    } }
  })
  if (!deleted) {
    return res.status(409).json({ message: "Can't Delete a Project with Active Submissions" })
  }
  return res.status(200).json({ message: "Done", deleted })
  // return res.status(204).send()
  } catch (error:any) {
    if(error.code=='P2002'){
      return res.status(409).json({message:"Can't Delete a Project with Active Submissions"})
    }
    console.log(error)
    return res.status(500).json({ message:"Internal Server Error"})
  }
}

export const getProjectbyId = async( req:Request, res: Response) => {
  const id = parseInt(req.params.id as string)
  const userId = req.userId
  console.log(id)

  const project = await prismaClient.project.findUnique({
    relationLoadStrategy: 'join',
    where: { id: id },
    select: {
      id: true, name: true, description: true, skillsreq: true, refrenceLink:true, mainFeature:true,
      owner: {
        select: {
          user: {
            select: {
              name: true, id: true
            }
          }
        }
      }, submits: {
        select: {
          liveLink: true, repoLink: true, id: true,
          // here we are counting stars related to this submission
           _count: {
          select: { 
            stars: true
          },
        },
          stars:{
            where:{
              userId:userId
            }
          },
          dev: {
            select: {
              user: {
                select: {
                  name: true, id: true
                }
              }
            }
          }
        }
      }
    }
  })
  if(!project){
      return res.status(404).json({ message:"Project Not Found"})
    }
  return res.json({ message: "Done", project })
}