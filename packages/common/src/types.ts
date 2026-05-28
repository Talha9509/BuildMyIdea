
import {z} from 'zod'

export const UserSchema=z.object({
    email:z.string().regex(/@/,"Invalid Email"),
    password:z.string().min(6,"Password must be atleast 6 characters"),
    name:z.string().optional()
})

export const ProjectSchema=z.object({
    name:z.string().min(3,"Give a Proper Name to the Project"),
    description:z.string().min(10,"Give a Proper Description for the Project"),
    skillsreq:z.string().optional(),
    refrenceLink:z.string().optional(),
    mainFeature:z.string().min(3,"Give a Vaild Main Feature for the Project")
})

export const updateProjectSchema=z.object({
    name:z.optional(z.string().min(3,"Give a Proper Name to the Project")),
    description:z.optional(z.string().min(10,"Give a Proper Description for the Project")),
    skillsreq:z.string().optional(),
    refrenceLink:z.string().optional(),
    mainFeature:z.optional(z.string().min(3,"Give a Vaild Main Feature for the Project"))
})

export const updateUserSchema=z.object({
    name:z.string().min(2,"Name Required"),
    job:z.string().optional(),
    role:z.enum(["DEV","OWNER"]).optional(),
    phone:z.string().optional().refine((val) => !val || /^\d{10}$/.test(val), "Phone number should be 10 digits"),
    // phone:z.optional(z.number().min(10,"Phone number should contain 10 charcters")),
    email:z.optional(z.string().regex(/@/,"Invalid Email"))
})

export const submitSchema=z.object({
    repoLink:z.string().min(6,"Give a Proper Link"),
    liveLink:z.string().min(6,"Give a Proper Link")
})

export const updateSubmitSchema=z.object({
    repoLink:z.optional(z.string().min(6,"Give a Proper Link")),
    liveLink:z.optional(z.string().min(6,"Give a Proper Link"))
})

export const searchQuerySchema = z.object({
    query: z.string().min(4)
})