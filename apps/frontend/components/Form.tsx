"use client"
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { UserSchema } from '@repo/common/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../utils/Apifetch'

const Form = (props: any) => {
  const router = useRouter()
  const [onLoading, setonLoading] = useState(false)
  const url = process.env.BACKEND_URL || "http://localhost:3001"
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(UserSchema) })

  async function onSubmit(data: any) {
    setonLoading(true)
    try {
      console.log(`${url}/api/v1/${props.method}`)
      const response = await apiFetch(`${url}/api/v1/${props.method}`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      })
      setonLoading(false)
      if(response){
        router.push("/projects")
      }

      // console.log(response)
      // console.log(response.message)

      // if (response.status === 200) {
      // }
      // todo: use react toastify
      // if (response.status === 409) {
      //   console.log("User Already Exists")
      // }
      // if (response.status === 401) {
      //   console.log("Incorrect Password")
      // }
      // if (response.status === 404) {
      //   console.log("User Not Found")
      // }
      // console.log(errors)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} >
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
            {errors.password && <div className='text-sm pb-1 px-2'>
              {errors.password?.message}
            </div>}
          </div>
          <div>
            <button type='submit' disabled={onLoading} className='disabled:bg-blue-400   border-black border-2 rounded-4xl px-2  min-w-[15vw] cursor-pointer bg-blue-800 hover:bg-blue-900 text-white text-lg transition duration-300 ease-in-out' >{onLoading ? `Loading...` : `Submit`}</button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default Form






