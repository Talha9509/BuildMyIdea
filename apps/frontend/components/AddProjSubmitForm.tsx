"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectSchema, submitSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AddEditForm = (props: any) => {
  const schema = props.project ? ProjectSchema : submitSchema
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [onLoading, setOnLoading] = useState(false)
  const [onblur, setOnblur] = useState(false)
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

  async function Add() {
    console.log("clicked")
    setOnblur(true)
  }

  async function Edit() {
    console.log("clicked")
    setOnblur(true)
    if (props.project) {
      console.log(props.EditProject)
      reset({
        name: props.EditProject.name,
        description: props.EditProject.description,
        skillsreq: props.EditProject.skillsreq,
      })
    } else {
      console.log(props.EditSubmit)
      reset({
        liveLink: props.EditSubmit.liveLink,
        repoLink: props.EditSubmit.repoLink
      })
    }
  }

  async function onsubmit(data: any) {
    setOnLoading(true)
    console.log(`${url}/api/v1/${props.method}`)
    const newUrl = props.project ? `${url}/api/v1/${props.to}` : `${url}/api/v1/${props.to}/${props.id}`
    const response = await fetch(`${newUrl}`, {
      method: `POST`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
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
    {onLoading && <div className='w-screen h-screen flex items-center justify-center text-5xl backdrop-blur-sm fixed top-0 left-0 z-40 bg-gray-50/10 text-black'>Loading...</div>}

    <div className='border p-2'><button onClick={Add}>{props.title}</button></div>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 bg-white'>
            <button onClick={() => setOnblur(false)}>close</button>
            <div className='text-2xl'>{props.title}</div>

            {props.proj && <div>
              <div>Name: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("name")} /></div>
              <div>Description <div><textarea className='border-black border-2 rounded-xl  px-2 py-1 focus:outline-none min-w-[20vw]' {...register("description")} rows={3} /></div></div>
              <div>Skills required <div><textarea className='border-black border-2 rounded-xl  px-2 py-1 focus:outline-none min-w-[20vw]' {...register("skillsreq")} rows={2} /></div></div>
              <div>Note: Write Skills with comma in between</div>
            </div>}

            {!props.proj && <div>
              <div>Live Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("liveLink")} /></div>
              <div>Repo Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("repoLink")} /></div>
            </div>}

            <input type="submit" className='border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out' />
          </div>
        </div>
      </form>}

  </div>)
}

export default AddEditForm
