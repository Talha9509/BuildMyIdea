import {Request,Response,NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
const secret=process.env.JWT_SECRET 

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies['jwt']
    if(!token){
        return res.status(401).json({ message:"Unauthorized" })
    }
    const decoded=jwt.verify(token,secret!)
    console.log(decoded)
    if(!decoded){
        return res.status(401).json({ message:"Unauthorized" })
    }
    req.userId=(decoded as JwtPayload).userId 
    next()
}