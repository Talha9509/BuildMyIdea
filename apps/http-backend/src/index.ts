import express,{Request,Response} from 'express'
import {UserSchema} from '@repo/common/types'
import {prismaClient} from '@repo/db/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { middleware } from './middleware.js'
import cors from 'cors'
import 'dotenv/config'

const app=express()

app.use(express.json())
app.use(cors())
const secret = process.env.JWT_SECRET!;
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const PORT=process.env.PORT || 3001

app.post("/api/v1/signup", async (req:Request,res:Response)=>{
    const input=req.body;
    const validatedInput=UserSchema.safeParse(input)
    if(!validatedInput.success){
        res.status(411).json({
            message:"Incorrect inputs"
        })
        return
    }

    try {
        const pass=validatedInput.data.password
        console.log(pass)
        const hashedPass=await bcrypt.hash(pass,10)
        console.log(hashedPass)
        const user=await prismaClient.user.create({
            data:{
                email:validatedInput.data.email,
                password:hashedPass,
                name:validatedInput.data.name
            }
        })
        
        const token=jwt.sign({userId:user.id},secret,{expiresIn:"72h"})
        console.log(token)

        return res.json({
            message:"Account created",
            token
        })

    } catch (error) {
        return res.status(409).json({
            message:"User already exists"
        })
    }
})

app.post("/api/v1/signin", async (req:Request,res:Response)=>{
    const input=req.body;
    const validatedInput=UserSchema.safeParse(input)
    if(!validatedInput.success){
        res.json({
            message:"Incorrect inputs"
        })
        return
    }

    try {
        const user=await prismaClient.user.findFirst({
            where:{
                email:validatedInput.data.email,
            }
        })
        if(!user){
            return res.status(404).json({ message:"User not Found" })
        }
        const pass=validatedInput.data.password
        console.log(pass)
        const corr=await bcrypt.compare(pass,user.password)
        console.log(corr)
        if(!corr){
            return res.status(409).json({message:"Password is Wrong"})
        }
        
        const token=jwt.sign({userId:user.id},secret,{expiresIn:"72h"})
        console.log(token)

        return res.json({
            message:"Signed in",
            token
        })

    } catch (error) {
        return res.status(409).json({
            message:"User already exists"
        })
    }
})

app.post("/api/v1/projects", middleware , async (req,res)=>{
    // @ts-ignore
  const userId = req.userId; 

  // Use the userId in your application logic (e.g., fetching user data from DB)
  res.send(`Welcome to your profile, User ${userId}!`);
})

app.post("/logout", async (req,res)=>{
    // @ts-ignore
    const userId=req.userId
    
})

app.listen(PORT,()=>{
    console.log("Listening on port: "+PORT)
})