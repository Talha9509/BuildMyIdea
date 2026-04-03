"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import edit from '../public/edit.svg'
import Delete from '../public/delete.svg'
import Cross from '../public/cross.svg'

export const EditDeleteProj = (props: any) => {
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(ProjectSchema), defaultValues: { name: "", description: "", skillsreq: "" } })
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

  console.log(errors)

  async function Edit() {
    console.log("clicked")
    setOnblur(true)

    if (props.EditProject) {
      console.log(props.EditProject)
      reset({
        name: props.EditProject.name,
        description: props.EditProject.description,
        skillsreq: props.EditProject.skillsreq,
      })
    }
  }

  async function onsubmit(data: any) {
    setOnLoading(true)
    const response = await fetch(`${url}/api/v1/project/${props.id}`, {
      method: `${props.method}`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, ...(props.method == 'PATCH' ? { body: JSON.stringify(data) } : null)
    })
    const res = await response.json()
    console.log(res)
    if (response.status === 200) {
      setOnblur(false)
      router.refresh()
      setOnLoading(false)
    }
    console.log(res.project)

  }
  return (<div>
    {/* {onLoading && <div className='w-screen h-screen flex items-center justify-center text-5xl backdrop-blur-sm fixed top-0 left-0 z-40 bg-gray-50/10 text-black'>Loading...</div>} */}

    <button onClick={props.method === 'DELETE' ? onsubmit : Edit} className='flex gap-1  p-1 cursor-pointer rounded-2xl font-medium bg-gray-800 hover:bg-gray-600 text-black items-center'><div className=' text-black'>
      {props.method=='DELETE' ? <Image src={Delete} width={15} alt='Delete'></Image> : <Image src={edit} width={15} alt='Edit'></Image>}
      </div></button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 gap-2 bg-white rounded-2xl relative'>

            {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

            <div className='relative'>
            <button className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl text-center'>{props.title}</div>

            <div className='flex flex-col gap-1'>
              
              <div>
                <div>Name: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[10vw]' {...register("name")} /></div>
              {errors.name && <div  className='text-sm px-2'>{errors.name.message}</div>}
              </div>

              <div>
              <div>Description <div><textarea className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none min-w-[20vw]' {...register("description")} rows={3} /></div></div>
              {errors.description && <div className='text-sm px-2'>{errors.description.message}</div>}
              </div>

              <div>
              <div>Skills required <div><textarea className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none min-w-[20vw]' {...register("skillsreq")} rows={2} /></div></div>
              <div className='text-sm'>Write Skills with comma in between</div>
              </div>
            </div>

            <input type="submit" className={`border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} />
          </div>
        </div>
      </form>}

  </div>)
}
