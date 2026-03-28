"use client"
import { useForm } from 'react-hook-form'
import React from 'react'
import { UserSchema } from '@repo/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Form = (props: any) => {
    const router = useRouter()
    const url = process.env.BACKEND_URL || "http://localhost:3001"
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(UserSchema) })
    // console.log(errors)
    async function onSubmit(data: any) {
        console.log(`${url}/api/v1/${props.method}`)
        const response = await axios.post(`${url}/api/v1/${props.method}`, data)
        console.log(response)
        console.log(response.data, response.data.message, response.data.token)
        // const data1=JSON.parse(response)
        try {
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token)
                router.push("/")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className=''>
                {/* flex   border-2 justify-center items-center */}
                <div className=' p-2 flex flex-col justify-center items-center gap-2  max-w-[60vw] '>
                    {props.boolean && <div>
                        <input {...register("name")} placeholder='Name' className='border-black border-2 rounded-4xl p-1 px-2 focus:outline-none min-w-[20vw]' />
                    </div>}
                    <div className='flex flex-col'>
                    <div>
                        <input  {...register("email")} placeholder='Email' className='border-black border-2 rounded-4xl p-1 px-2 focus:outline-none min-w-[20vw]' />
                    </div>
                    {errors.email && <div className='text-sm px-4 pb-1'>
                        {errors.email?.message}
                    </div>}
                    </div>
                    <div className='flex flex-col'>
                    <div>
                        <input  {...register("password")} type='password' placeholder='Password' className='border-black border-2 rounded-4xl p-1 px-2 focus:outline-none min-w-[20vw]' />
                    </div>
                    {errors.email && <div className='text-sm pb-1 px-2'>
                        {errors.password?.message}
                    </div>}
                    </div>
                    <div>
                        <input type='submit' className='border-black border-2 rounded-4xl px-2 my-2 min-w-[15vw] cursor-pointer bg-blue-700 hover:bg-blue-800 text-white text-lg transition duration-300 ease-in-out' /> 
                    </div>

                </div>
            </form>
        </div>
    )
}

export default Form
