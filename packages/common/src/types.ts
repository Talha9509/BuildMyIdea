
import z from 'zod'

export const OwnerSchema=z.object({
    email:z.string().regex(/@/),
    password:z.string().min(6)
})

export const DevSchema=z.object({
    email:z.string().regex(/@/),
    password:z.string().min(6)
})