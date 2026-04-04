"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import edit from '../public/editProfile.svg'
import { toast } from 'sonner'
import Cross from '../public/cross.svg'
import { apiFetch } from '@/utils/Apifetch'

export const EditProfile = (props: any) => {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(updateUserSchema), defaultValues: { name: "", job: "", role: "OWNER", phone: "", email: "" } })
  // const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(updateUserSchema), defaultValues: { name: "", job: "", role: undefined, phone: "", email: "" } })
  const [onblur, setOnblur] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
  const role = watch("role")

  const url = process.env.BACKEND_URL || "http://localhost:3001"
  useEffect(() => {
    if (onblur) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [onblur])

  async function Edit() {
    console.log("clicked")
    setOnblur(true)
    reset({
      name: props.user.name || "",
      job: props.user.job || undefined,
      role: props.user.role || "OWNER",
      phone: props.user.phone || undefined,
      email: props.user.email || undefined
    })
  }

  console.log(errors)
  async function onsubmit(data: any) {
    console.log("loading")
    setOnLoading(true)
    const response = await apiFetch(`${url}/api/v1/${props.to}`, {
      method: `${props.method}`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, ...(props.method == 'PATCH' ? { body: JSON.stringify(data) } : null)
    })

    setOnLoading(false)
    if (response) {
      setOnblur(false)
      router.refresh() 
      toast.success("Profile Edited", { duration: 5000 });
      
    }

  }
  return (<div>
    <button onClick={Edit} className='flex gap-1 border px-2  cursor-pointer rounded-lg  bg-gray-100 hover:bg-gray-300 text-black items-center'><div className=' text-black'><Image src={edit} height={15} alt='Plus'></Image></div>{props.title}</button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 bg-white gap-2 rounded-2xl relative'>

            {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

            <div className='relative'>
              <button className=' absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl text-center'>{props.title}</div>

            <div className='flex flex-col gap-2'>
              <div>
                <div>Name: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[10vw]' {...register("name")} /></div>
                {errors.name && <div className='text-sm px-2'>{errors.name?.message}</div>}
              </div>

              <div>
                <div>Email: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("email")} /></div>
                {errors.email && <div className='text-sm px-2'>{errors.email?.message}</div>}
              </div>

              <div>
                <div className='flex gap-1 items-center'>
                  <div>Role:</div>
                  <button className={`border-2 p-1 px-2 rounded-2xl ${role == "OWNER" ? `border-blue-950 text-blue-950 bg-blue-100` : ``}`} type='button' onClick={() => setValue("role", "OWNER")}>Idea Creator</button>
                  <button type='button' className={`border-2 p-1 px-2 rounded-2xl ${role == "DEV" ? `border-blue-950 text-blue-950 bg-blue-100` : ``} `} onClick={() => setValue("role", "DEV")}>Developer</button>
                </div>
                <div className='text-sm px-2'>Default is Idea Creator</div>
              </div>

              <div>Job: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("job")} /></div>

              <div>
                <div>Phone: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("phone")} /></div>
                {errors.phone && <div className='text-sm px-2'>{errors.phone?.message}</div>}
              </div>
            </div>

            <input type="submit" className={`border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} />
          </div>
        </div>
      </form>}

  </div>)
}
