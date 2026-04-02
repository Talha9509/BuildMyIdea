"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const EditProfile = (props: any) => {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(updateUserSchema), defaultValues: { name: "", job: "", role: "OWNER", phone: "", email: "" } })
  // const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(updateUserSchema), defaultValues: { name: "", job: "", role: undefined, phone: "", email: "" } })
  const [onblur, setOnblur] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
  const role=watch("role")

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
      job:  props.user.job || undefined,
      role: props.user.role || "OWNER",
      phone:  props.user.phone || undefined,
      email: props.user.email || undefined
    })
  }

  console.log(errors)
  async function onsubmit(data: any) {
    console.log("loading")
    setOnLoading(true)
    const response = await fetch(`${url}/api/v1/${props.to}`, {
      method: `${props.method}`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, ...(props.method == 'PATCH' ? { body: JSON.stringify(data) } : null)
    })
    const res = await response.json()
    console.log(res)

    if (response.status === 200) {
      setOnblur(false)
      setOnLoading(false)
      router.refresh()
    }
    console.log(res.project)

  }
  return (<div>
    {/* {onLoading && <div className='w-screen h-screen flex items-center justify-center text-5xl backdrop-blur-sm fixed top-0 left-0 z-40 bg-gray-50/10 text-black'>Loading...</div>} */}
    <div className='border p-2'><button onClick={Edit}>{props.title}</button></div>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 bg-white relative'>

            {onLoading && <div className=' absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-sm z-40 bg-gray-200/10 text-black'>Loading...</div>}

            <button onClick={() => setOnblur(false)}>close</button>
            <div className='text-2xl'>{props.title}</div>

            <div>
              <div>Name: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("name")} /></div>
              {errors.name && <div>{errors.name?.message}</div>}

              <div>Email: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("email")} /></div>
              {errors.email && <div>{errors.email?.message}</div>}

              <div>Role:
                <button className={`border p-1 ${role=="OWNER" ? `border-blue-800 text-blue-800` : ``}`} type='button' onClick={() => setValue("role", "OWNER")}>Idea Creator</button>
                <button type='button' className={`border p-1 ${role=="DEV" ? `border-blue-800 text-blue-800` : ``} `} onClick={() => setValue("role", "DEV")}>Developer</button>
                <div>Default is Idea Creator</div>
              </div>

              <div>Job: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("job")} /></div>

              <div>Phone: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("phone")} /></div>
              {errors.phone && <div>{errors.phone?.message}</div>}
            </div>

            <input type="submit" className={`border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} />
          </div>
        </div>
      </form>}

  </div>)
}
