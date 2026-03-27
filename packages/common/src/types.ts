
import {z} from 'zod'

export const UserSchema=z.object({
    email:z.string().regex(/@/,"Invalid Email"),
    password:z.string().min(6,"Password must be atleast 6 characters long"),
    name:z.string().optional()
})

export const ProjectSchema=z.object({
    name:z.string().min(3,"Give a Proper Name to the Project"),
    description:z.string().min(10,"Give a Proper Description for the Project"),
    skillsreq:z.string().optional()
})

export const updateProjectSchema=z.object({
    name:z.optional(z.string().min(3,"Give a Proper Name to the Project")),
    description:z.optional(z.string().min(10,"Give a Proper Description for the Project")),
    skillsreq:z.string().optional()
})

export const updateUserSchema=z.object({
    name:z.string().optional(),
    job:z.string().optional(),
    role:z.enum(["DEV","OWNER"]).optional(),
    phone:z.optional(z.number().min(10,"Phone number should contain 10 charcters"))
})

export const submitSchema=z.object({
    repoLink:z.string().min(6),
    liveLink:z.string().min(6)
})

export const updateSubmitSchema=z.object({
    repoLink:z.optional(z.string().min(6)),
    liveLink:z.optional(z.string().min(6))
})