import express, { Request, Response } from 'express'
import { UserSchema, ProjectSchema, updateUserSchema, updateProjectSchema } from '@repo/common/types'
import { prismaClient } from '@repo/db/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { middleware } from './middleware.js'
import cors from 'cors'
import 'dotenv/config'

const app = express()

app.use(express.json())
app.use(cors())

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

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    const input = req.body;
    const validatedInput = UserSchema.safeParse(input)
    if (!validatedInput.success) {
        return res.status(411).json({ message: "Incorrect inputs" })
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

        return res.json({ message: "Account created", token })
    } catch (error) {
        return res.status(409).json({ message: "User already exists" })
    }
})

app.post("/api/v1/signin", async (req: Request, res: Response) => {
    const input = req.body;
    const validatedInput = UserSchema.safeParse(input)
    if (!validatedInput.success) {
        return res.json({ message: "Incorrect inputs" })
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: validatedInput.data.email,
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }
        const pass = validatedInput.data.password
        console.log(pass)
        const corr = await bcrypt.compare(pass, user.password)
        console.log(corr)
        if (!corr) {
            return res.status(409).json({ message: "Password is Wrong" })
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "72h" })
        console.log(token)

        return res.json({ message: "Signed in", token })
    } catch (error) {
        return res.status(409).json({ message: "User already exists" })
    }
})

app.patch("/api/v1/profile", middleware, async (req, res) => {
    const userId = req.userId
    if (typeof userId != 'number') {
        return res.status(401).json({ message: "Unauthourized" })
    }
    const validated = updateUserSchema.safeParse(req.body)
    if (!validated.success) {
        return res.status(411).json({ message: "Invalid Inputs" })
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
                    data: otherFields,
                });
            }
            return res.json({ message: "Profile Updated", role: currentRole });
        }
        if (currentRole === "DEV" && user.dev) {
            const hasProjects = await prismaClient.project.count({
                where: { devId: user.dev?.id }
            })
            if (hasProjects > 0) {
                return res.status(409).json({ message: "Cannot change roles with Active Projects" })
            }
        }
        if (currentRole === "OWNER" && user.owner) {
            const hasProjects = await prismaClient.project.count({
                where: { ownerId: user.owner?.id }
            })
            if (hasProjects > 0) {
                return res.status(409).json({ message: "Cannot change roles with Active Projects" })
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
                    data: otherFields
                })
            }
            return { role: role }
        })
        return res.json({ message: "Profile Updated", role: result?.role })
    } catch (error: any) {
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
        where: { id: id },
        select: {
            email: true, name: true, job: true, phone: true,
            owner: {
                select: {
                    projects: {
                        select: {
                            name: true, description: true, skillsreq: true
                        }
                    }
                }
            },
            dev: {
                select: {
                    projects: {
                        select: {
                            name: true, description: true, skillsreq: true
                        }
                    }
                }
            }
        }
    })
    // in profile, i also want the profile's projects, if owner, then owner/posted projects and vice versa
    console.log(user)
    return res.json({ user })
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
        return res.status(400).json({ message: "Invalid Inputs" })
    }

    try {
        const owner = await prismaClient.owner.findUnique({
            where: { userId: userId }
        })
        if (!owner) {
            return res.status(403).json({ message: "Owner not Found" })
        }
        const project = await prismaClient.project.create({
            data: {
                name: validated.data.name,
                description: validated.data.description,
                ownerId: owner.id
            }
        })
        console.log("project: " + project)
        return res.json({ project: project })
    }
    catch (err: any) {
        console.log(err)
        return res.status(409).json({ message: "Projext already exists" })
    }
})

app.patch("/api/v1/project/:id", middleware, async (req, res) => {
    // to edit a project by owner
    const userId = req.userId;
    const body = req.body
    const id = parseInt(req.params.id as string)
    if (typeof userId != 'number') {
        return res.status(401).json({ message: "Unauthoized" })
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
            return res.status(403).json({ message: "NOT allowed to edit this project" })
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
            return res.status(409).json({ message: "Name already Exists" })
        }
        if (err.code === "P2025") {
            console.log(err)
            return res.status(404).json({ message: "Project Not Found" })
        }
        console.log(err)
        return res.status(500).json({ message: "DB/Internal Server Error" })
    }
})

app.delete("/api/v1/project/:id", middleware, async (req, res) => {
    // delte a project if owner wants to delete it
    const userId = req.userId
    const id = parseInt(req.params.id as string)

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
        return res.status(403).json({ message: "Not Authorized to Delete Project" })
    }
    const deleted = await prismaClient.project.delete({
        where: { id: id }
    })
    if (!deleted) {
        return res.status(404).json({ message: "Project Not Found" })
    }
    return res.json({message:"Done",deleted})
})

// not complted
app.post("api/v1/project/submit/:id", middleware, async (req, res) => {
    // the dev will post the code repo link of github
})

// not complted
app.patch("api/v1/project/submit/:id", middleware, async (req, res) => {
    // the dev wants to make some changes in the submission of  code repo link of github
})

// not complted
app.delete("api/v1/project/submit/:id", middleware, async (req, res) => {
    // the dev wants to delete the posted code repo link of github
})

app.get("/api/v1/projects", middleware, async (req, res) => {
    const projects=await prismaClient.project.findMany()
    res.json({ message:"Done", projects })
})

app.get("/api/v1/project/:id", middleware, async (req, res) => {
    const id=parseInt(req.params.id as string)
    const userId=req.userId
    console.log(id)

    const project=await prismaClient.project.findUnique({
        where:{ id:id }
    })
    return res.json({message:"Done",project})
})

// not complted
app.post("api/v1/stars", middleware, async (req, res) => {
    // one more endpoint of owner giving stars to the projects which he like from whatt devs made for the wish of owner
    // if owner gives stars here, then give star to the repo in github(it would only work when owner is signed up using github and dev also)
})

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)
})