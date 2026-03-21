
import {z} from 'zod'

export const UserSchema=z.object({
    email:z.string().regex(/@/,"Invalid Email"),
    password:z.string().min(6,"Password must be atleast 6 characters long"),
    name:z.string().optional()
})

export const OwnerSchema=z.object({
    role:z.enum(["OWNER","DEV"])
})

export const DevSchema=z.object({
    role:z.enum(["OWNER","DEV"])
})