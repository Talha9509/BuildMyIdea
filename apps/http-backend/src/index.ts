import express, { Request, Response } from 'express'
import { UserSchema, ProjectSchema, updateUserSchema, updateProjectSchema, submitSchema, updateSubmitSchema } from '@repo/common/types'
import 'dotenv/config'
import { prismaClient } from '@repo/db/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { middleware } from './middleware/middleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import authRoutes from './routes/auth.Routes.js'

const app = express()
app.set('trust proxy', 1);
const frontend=["http://localhost:3000","http://frontend:3000"]

app.use(express.json())
app.use(cors({
  origin: frontend,
  credentials: true
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use("/auth", authRoutes);

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
    }
  }
}

const secret = process.env.JWT_SECRET!;
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const PORT = process.env.PORT || 3001

app.use((req, res, next) => {
  // Record the start time
  const start = performance.now();

  // Listen for the 'finish' event on the response object
  res.on('finish', () => {
    // Record the end time
    const end = performance.now();
    const duration = end - start;
    
    console.log(`[${req.method}] ${req.originalUrl} took ${duration.toFixed(2)}ms`);
  });

  // Call next() to pass control to your actual routes/controllers
  next(); 
});

app.post("/api/v1/signup", async (req: Request, res: Response) => {
  console.log(`database url: ${process.env.DATABASE_URL}`)
  const input = req.body;
  const validatedInput = UserSchema.safeParse(input)
  if (!validatedInput.success) {
    return res.status(400).json({ message: "Invalid inputs" })
  }

  try {
    const pass = validatedInput.data.password
    console.log(pass)
    const hashedPass = await bcrypt.hash(pass, 10)
    console.log(hashedPass)
    const user = await prismaClient.user.create({
      data: {
        email: validatedInput.data.email,
        password: hashedPass,
        name: validatedInput.data.name
      }
    })

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "72h" })
    console.log(token)

    return res.status(201).cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 72 * 60 * 60 * 1000
    }).json({ message: "Account created" })
  } catch (error:any) {
    if(error.code=='P2002'){
      return res.status(409).json({ message: "User Already Exists" })
    }
    console.log(error)
    return res.status(500).json({ message:"Internal Server Error" })
  }
})

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const input = req.body;
  const validatedInput = UserSchema.safeParse(input)
  if (!validatedInput.success) {
    return res.status(400).json({ message: "Invalid inputs" })
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: validatedInput.data.email,
      }
    })
    if (!user) {
      return res.status(404).json({ message: "Create an Account First" })
    }
    if (!user.password) {
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "72h" })
      console.log(token)

      return res.status(200).cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      }).json({ message: "Signed in" })
    }
    const pass = validatedInput.data.password
    console.log(pass)
    const correct = await bcrypt.compare(pass, user.password)
    console.log(correct)
    if (!correct) {
      return res.status(401).json({ message: "Incorrect Password" })
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "72h" })
    console.log(token)

    return res.status(200).cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    }).json({ message: "Signed in" })
  } catch (error) {
    return res.status(409).json({ message: "User Already Exists" })
  }
})

app.post("/api/v1/projects", middleware, async (req, res) => {
  const userId = req.userId;
  const body = req.body
  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthoized" })
  }
  console.log(userId)

  const validated = ProjectSchema.safeParse(body)
  console.log(validated)
  if (!validated.success) {
    return res.status(422).json({ message: "Invalid Inputs" })
  }

  try {
    const owner = await prismaClient.owner.findUnique({
      where: { userId: userId }
    })
    if (!owner) {
      return res.status(403).json({ message: "Only Idea Creator can Add Project" })
    }
    const project = await prismaClient.project.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        ownerId: owner.id,
        skillsreq:validated.data.skillsreq,
        refrenceLink:validated.data.refrenceLink,
        mainFeature:validated.data.mainFeature
      }
    })
    if (!project) {
      return res.status(409).json({ message: "Project Already Exists" })
    }
    console.log("project: " + project)
    return res.status(201).json({ message: "Done", project:project  })
  }
  catch (err: any) {
    if (err.code=='P2002') {
      return res.status(409).json({ message: "Project Already Exists" })
    }
    console.log(err)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

app.get("/api/v1/projects", middleware, async (req, res) => {
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
})

app.patch("/api/v1/project/:id", middleware, async (req, res) => {
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
})

app.delete("/api/v1/project/:id", middleware, async (req, res) => {
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
  
})

app.get("/api/v1/project/:id", middleware, async (req, res) => {
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
          liveLink: true, repoLink: true,
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
})

// need to change sth as dev now has submissions. so before changing dev to owner, he cant have submissions
// no need to do that. because if a dev has project, then he has submits and vice versa
app.patch("/api/v1/profile", middleware, async (req, res) => {
  const userId = req.userId
  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthourized" })
  }
  const validated = updateUserSchema.safeParse(req.body)
  if (!validated.success) {
    return res.status(400).json({ message: "Invalid Inputs" })
  }
  console.log(validated.data)

  const { role, ...otherFields } = validated.data

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { owner: true, dev: true }
    })
    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }

    let currentRole: "DEV" | "OWNER" | null = null
    console.log(user.owner, user.dev)
    // if you want to keep role in user table, then make use of it
    if (user.owner) currentRole = "OWNER"
    if (user.dev) currentRole = "DEV"

    if (role && role == currentRole) {
      if (Object.keys(otherFields).length > 0) {
        await prismaClient.user.update({
          where: { id: userId },
          
          data: validated.data,
        });
      }
      return res.json({ message: "Profile Updated", role: currentRole });
    }
    if (currentRole === "DEV" && user.dev) {
      // check if he has submits. as submit.count
      const hasSubmits = await prismaClient.submit.count({
        where: { devId: user.dev?.id }
      })
      if (hasSubmits > 0) {
        return res.status(409).json({ message: "Cannot Change Roles with Active Submits" })
      }
    }
    if (currentRole === "OWNER" && user.owner) {
      const hasProjects = await prismaClient.project.count({
        where: { ownerId: user.owner?.id }
      })
      if (hasProjects > 0) {
        return res.status(409).json({ message: "Cannot Change Roles with Active Projects" })
      }
    }
    const result = await prismaClient.$transaction(async (txn) => {
      if (currentRole === "DEV") {
        await txn.dev.delete({ where: { userId } })
      }
      if (currentRole === "OWNER") {
        await txn.owner.delete({ where: { userId } })
      }
      if (role === "DEV") {
        await txn.dev.create({ data: { userId } });
      }

      if (role === "OWNER") {
        await txn.owner.create({ data: { userId } });
      }
      if (Object.keys(otherFields).length > 0) {
        await txn.user.update({
          where: { id: userId },
          
          data: validated.data
        })
      }
      return { role: role }
    })
    return res.status(200).json({ message: "Profile Updated", role: result?.role })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

app.get("/api/v1/profile/me", middleware, async (req, res) => {
  console.log(process.env.DATABASE_URL)
  const userId = req.userId
  // same profile will be shown to user and others. only difference is, user can edit his profile
  // for checking others profile, email and phone will only be visible when both are connected
  try {
    const user = await prismaClient.user.findUnique({
      relationLoadStrategy: 'join',
      where: { id: userId },
      select: {
        email: true, name: true, job: true, phone: true, role:true,
        owner: {
          select: {
            projects: {
              select: {
                name: true, description: true, mainFeature: true, id:true, skillsreq:true, refrenceLink:true
              }
            }
          }
        },
        dev: {
          select: {
            submissions: {
              select: {
                repoLink: true, liveLink: true, id:true
              }
            }
          }
        }
      }
    })
    // in profile, i also want the profile's projects, if owner, then owner/posted projects and vice versa
    console.log(user)
    return res.json({ message: "Done", user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }

})

app.get("/api/v1/profile/:id", middleware, async (req, res) => {
  const userId = req.userId
  const id = parseInt((req.params.id) as string)
  // same profile will be shown to user and others. only difference is, user can edit his profile
  // for checking others profile, email and phone will only be visible when both are connected
  const user = await prismaClient.user.findUnique({
    relationLoadStrategy: 'join',
    where: { id: id },
    select: {
      name: true, job: true, role:true,
      owner: {
        select: {
          projects: {
            select: {
              name: true, description: true, skillsreq: true, id:true, mainFeature:true
            }
          }
        }
      },
      dev: {
        select: {
          submissions: {
            select: {
              repoLink: true, liveLink: true
            }
          }
        }
      }
    }
  })
  // in profile, i also want the profile's projects, if owner, then owner/posted projects and vice versa
  console.log(user)
  return res.status(200).json({ message: "Done", user })
})

app.post("/api/v1/submit/:id", middleware, async (req, res) => {
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
    // first check dev or not, if dev then give project to dev with id
    // const dev2 = await prismaClient.dev.update({
    //     where: { userId: userId },
    //     data:{
    //         projects:{
    //             update:[{
    //                 where:{
    //                     id:projectId
    //                 },
    //                 data:{
    //                     devId:userId
    //                 }
    //             }]
    //         }
    // },
    // select: {
    //     projects: {
    //         select:{
    //             id:true
    //         }
    //     }
    // }
    // })
    const dev = await prismaClient.dev.findUnique({
      where: { userId: userId }
    })
    console.log(dev)
    if (!dev) {
      return res.status(403).json({ message: "Only Developers are allowed for Submissions" })
    }
    const project = await prismaClient.project.findUnique({
      // findunique instead of update and remove data
      where: { id: projectId },
    })
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
})

app.patch("/api/v1/submit/:id", middleware, async (req, res) => {
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
})

app.delete("/api/v1/submit/:id", middleware, async (req, res) => {
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
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
})

app.post("/api/v1/logout", async (req, res) => {
  console.log(req.headers)
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
  return res.status(200).json({ message: 'Done ' });
})

// next: not complted
app.post("api/v1/stars", middleware, async (req, res) => {
  // one more endpoint of owner giving stars to the projects which he like from whatt devs made for the wish of owner
  // if owner gives stars here, then give star to the repo in github(it would only work when owner is signed up using github and dev also)
})

// next: not complted
app.post("/api/v1/connect", async (req, res) => {
  // connection between owner and dev
})

app.listen(PORT, () => {
  console.log(process.env.DATABASE_URL)
  console.log("Listening on port: " + PORT)
})