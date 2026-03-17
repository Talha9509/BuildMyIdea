import express,{Request,Response} from 'express'
import {OwnerSchema} from '@repo/common/types'
import {prismaClient} from '@repo/db/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app=express()

app.use(express.json())
// app.use(cors)

app.post("/api/v1/signup/owner", async (req:Request,res:Response)=>{
    const input=req.body;
    const validatedInput=OwnerSchema.safeParse(input)
    if(!validatedInput.success){
        res.json({
            message:"Incorrect inputs"
        })
        return
    }

    try {
        const pass=validatedInput.data.password
        const hashedPass=await bcrypt.hash(pass,10)
        const owner=await prismaClient.owner.create({
            data:{
                email:validatedInput.data.email,
                password:hashedPass,
            }
        })
        const secret=process.env.JWT_SECRET || "1234567890"
        const token=jwt.sign({ownerId:owner.id},secret,{expiresIn:"72h"})

        res.json({
            message:"Account created",
            token
        })

    } catch (error) {
        res.status(411).json({
            message:"User already exists"
        })
    }
})

app.post("/signin", async (req:Request,res:Response)=>{

})

app.post("/projects", async (req,res)=>{

})

app.post("/logout", async (req,res)=>{

})

