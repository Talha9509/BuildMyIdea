"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const EditProfile = (props: any) => {
//   let schema = props.project ? ProjectSchema : submitSchema
  const router=useRouter()
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(updateUserSchema), defaultValues: { name: "", job: "", role: undefined, phone:"", email:""  }  })
    // , defaultValues: props.project ? { name: "", description: "", skillsreq: "" } : { liveLink: "", repoLink: "" } 
  const [onblur, setOnblur] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
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
    // if (props.project) {
    //   console.log(props.EditProject)
    //   reset({
    //     name: props.EditProject.name,
    //     description: props.EditProject.description,
    //     skillsreq: props.EditProject.skillsreq,
    //   })
    // } else {
    //   console.log(props.EditSubmit)
    //   reset({
    //     liveLink: props.EditSubmit.liveLink,
    //     repoLink: props.EditSubmit.repoLink
    //   })
    // }
    reset({
        name: props.user.name,
        job: props.user.job,
        role: props.user.role,
        phone:props.user.phone,
        email:props.user.email
      })
  }
  console.log(errors)
  async function onsubmit(data: any) {
    console.log("loading")
    setOnLoading(true)
    const response = await fetch(`${url}/api/v1/${props.to}`, {
      method: `${props.method}`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' },  ...(props.method == 'PATCH' ? { body: JSON.stringify(data) } : null)
    })
    const res = await response.json()
    console.log(res)

    if(response.status===200){
      setOnblur(false)
      setOnLoading(false)
      router.refresh()
    }
    console.log(res.project)

  }
  return (<div>
    {onLoading && <div className='w-screen h-screen flex items-center justify-center text-5xl backdrop-blur-sm fixed top-0 left-0 z-40 bg-gray-50/10 text-black'>Loading...</div>}

    <div className='border p-2'><button onClick={Edit}>{props.title}</button></div>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 bg-white'>
            <button onClick={() => setOnblur(false)}>close</button>
            <div className='text-2xl'>{props.title}</div>

            <div>
              <div>Name: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("name")} /></div>
              <div>Email: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("email")} /></div>
              {errors.email && <div>{errors.email?.message}</div>}
              <div>Role: 
                <button className={`border p-1 ${props.user.role=="OWNER" ? `border-blue-800 text-blue-800`: ``}`} type='button' onClick={()=>setValue("role","OWNER")}>Idea Creater</button>
                <button type='button' className={`border p-1 ${props.user.role=="DEV" ? `border-blue-800 text-blue-800`: ``} `} onClick={()=>setValue("role","DEV")}>Developer</button>
                {errors.role && <div>{errors.role?.message}</div>}
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
