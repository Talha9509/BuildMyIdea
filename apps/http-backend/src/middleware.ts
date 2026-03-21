import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
const secret=process.env.JWT_SECRET || "1234567890"

export const middleware=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers.authorization
    if(!token){
        return res.status(400).json({ message:"Unauthorized" })
    }
    const decoded=jwt.verify(token,secret)
    console.log(decoded)
    if(!decoded){
        return res.status(400).json({ message:"Unauthorized" })
    }
    // @ts-ignore
    req.userId=decoded.userId 
    next()
}