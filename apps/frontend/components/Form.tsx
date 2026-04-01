"use client"
import { useForm } from 'react-hook-form'
import React from 'react'
import { UserSchema } from '@repo/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

const Form = (props: any) => {
  const router = useRouter()
  const url = process.env.BACKEND_URL || "http://localhost:3001"
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(UserSchema) })
  async function onSubmit(data: any) {
    try {
      console.log(`${url}/api/v1/${props.method}`)
      const response = await fetch(`${url}/api/v1/${props.method}`, { method: 'POST', credentials: 'include',
         headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      })
      const res=await response.json()
      console.log(res)
      console.log(res.data, res.data.message, res.data.token)
      if (response.status === 200) {
        router.push("/")
      }
      // todo: use react toastify
      if (response.status === 409) {
        console.log("User Already Exists")
      }
      if (response.status === 401) {
        console.log("Incorrect Password")
      }
      if (response.status === 404) {
        console.log("User Not Found")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} >
        {/* flex   border-2 justify-center items-center */}
        <div className={` flex flex-col justify-center items-center gap-2 ${props.boolean ? "gap-2" : "gap-3"} max-w-[60vw] `}>
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
            <input type='submit' className='border-black border-2 rounded-4xl px-2  min-w-[15vw] cursor-pointer bg-blue-800 hover:bg-blue-900 text-white text-lg transition duration-300 ease-in-out' />
          </div>

        </div>
      </form>
    </div>
  )
}

export default Form
