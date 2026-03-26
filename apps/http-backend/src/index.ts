import express, { Request, Response } from 'express'
import { UserSchema, ProjectSchema, updateUserSchema } from '@repo/common/types'
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

    const body = req.body

    const validated = updateUserSchema.safeParse(body)
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
                await txn.dev.delete({
                    where: { userId }
                })
            }
            if (currentRole === "OWNER") {
                await txn.owner.delete({
                    where: { userId }
                })
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
        return res.status(411).json({ message: "Invalid Inputs" })
    }

    try {
        const owner = await prismaClient.owner.findFirst({
            where: { userId: userId }
        })
        if (!owner) {
            return res.status(401).json({ message: "Owner not Found" })
        }
        const project = await prismaClient.project.upsert({
            where: { name: validated.data.name },
            update: {},
            create: {
                name: validated.data?.name,
                Description: validated.data?.description,
                ownerId: owner?.id
            }
        })
        console.log("project: " + project)
        return res.json({ project: project })
    }
    catch (err: any) {
        console.log(err)
        return res.status(409).json({ message: "Unable to create Project" })
    }
})

app.patch("/api/v1/project/:id", middleware, async (req, res) => {
    // to edit a project
})

app.delete("/api/v1/project/:id", middleware, async (req, res) => {
    // delte a project
})

app.get("/api/v1/projects", middleware, async (req, res) => {

})

app.get("/api/v1/project/:id", middleware, async (req, res) => {

})

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT)
})