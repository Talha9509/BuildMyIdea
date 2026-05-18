import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { UserSchema } from "@repo/common/types";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET!;

export const signup = async (req: Request, res: Response) => {
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
        secure: process.env.NODE_ENV === "production",
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
};

export const signin = async (req: Request, res: Response) => {
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
          secure: process.env.NODE_ENV === "production",
          sameSite: 'lax',
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
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
      }).json({ message: "Signed in" })
    } catch (error) {
      return res.status(409).json({ message: "User Already Exists" })
    }
};

export const logout = async (req: Request, res: Response) => {
  console.log(req.headers)
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  return res.status(200).json({ message: 'Done ' });
};