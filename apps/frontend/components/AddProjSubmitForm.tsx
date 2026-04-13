"use client"
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectSchema, submitSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import Image from 'next/image'
import Plus from '../public/plus.svg'
import Cross from '../public/cross.svg'
import { toast } from 'sonner'
import { apiFetch } from '../utils/Apifetch'

type ProjectFormType = z.infer<typeof ProjectSchema>
type SubmitFormType = z.infer<typeof submitSchema>
type FormType = ProjectFormType | SubmitFormType

const AddEditForm = (props: any) => {
  const schema = props.project ? ProjectSchema : submitSchema
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormType>({ resolver: zodResolver(schema), defaultValues: props.project ? { name: "", description: "", mainFeature:"" } : { liveLink: "", repoLink: "" } })

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
    if (props.project) {
      reset({
        name: "",
        description: "",
        skillsreq: undefined,
        mainFeature:"",
        refrenceLink:undefined
      })
    } else {
      console.log(props.EditSubmit)
      reset({
        liveLink: "",
        repoLink: ""
      })
    }
  }

  const projectErrors = props.project ? (errors as FieldErrors<ProjectFormType>) : null
  console.log(projectErrors)
  const submitErrors = !props.project ? (errors as FieldErrors<SubmitFormType>) : null

  async function onsubmit(data: any) {
    setOnLoading(true)
    console.log(`${url}/api/v1/${props.to}`)
    const newUrl = props.project ? `${url}/api/v1/${props.to}` : `${url}/api/v1/${props.to}/${props.id}`
    const response = await apiFetch(`${newUrl}`, {
      method: `POST`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    })

    setOnLoading(false)
    if (response) {
      setOnblur(false)
      // next: use usestate to add a new project
      router.refresh()
      toast.success("Project Added", { duration: 5000 });
    }
  }
  return (<div>
    <button onClick={Add} className='flex gap-1 border px-2 py-1 cursor-pointer rounded-lg font-medium bg-gray-100 hover:bg-gray-300 text-black items-center'><div className=' text-black'><Image src={Plus} alt='Plus'></Image></div>{props.title}</button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8  gap-2 bg-white rounded-2xl relative'>

            {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

            <div className='relative'>
              <button className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl p-1 text-center'>{props.title}</div>

            {props.project && <div className='flex flex-col gap-1'>
              <div><div>Name: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[20vw]' {...register("name")} placeholder='Name of Project' /></div>
                {projectErrors?.name && <div className='text-sm px-2'>{projectErrors.name.message}</div>}
              </div>

              <div><div>Description <div><textarea className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none min-w-[25vw]' {...register("description")} rows={3} placeholder='Describe the Project Procedure and Key Functionality' /></div></div>
                {projectErrors?.description && <div className='text-sm px-2'>{projectErrors.description.message}</div>}
              </div>

              <div><div>Main Feature <div><input className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none min-w-[25vw]' {...register("mainFeature")} placeholder='Important Feature of Project' /></div></div>
                {projectErrors?.mainFeature && <div className='text-sm px-2'>{projectErrors.mainFeature.message}</div>}
              </div>

              <div><div>Refrence Link <span className='text-xs text-gray-500'>(optional)</span><div><input className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none min-w-[25vw]' {...register("refrenceLink")} placeholder='Any Refrence for the Project' /></div></div>
                {/* {projectErrors?.description && <div className='text-sm px-2'>{projectErrors.description.message}</div>} */}
              </div>

              <div><div>Skills required <span className='text-xs text-gray-500'>(optional)</span><div><textarea className='border-black border-2 rounded-lg  px-2 py-1  focus:outline-none min-w-[25vw]' {...register("skillsreq")} rows={1} placeholder='Enter Skills with comma in between' /></div></div>
                {/* <div className='text-sm'>Write Skills with comma in between</div> */}
                </div>

            </div>}

            {!props.project && <div className='flex flex-col gap-1 pb-2'>
              <div><div>Live Link: <input className='border-black border-2 rounded-lg px-2 focus:outline-none w-80' {...register("liveLink")} /></div>
                {submitErrors?.liveLink && <div className='text-sm px-2'>{submitErrors.liveLink.message}</div>}
              </div>

              <div><div>Repo Link: <input className='border-black border-2 rounded-lg px-2 focus:outline-none w-80' {...register("repoLink")} /></div>
                {submitErrors?.repoLink && <div className='text-sm px-2'>{submitErrors.repoLink.message}</div>}
              </div>
            </div>}

            <input type="submit" className='border-black border-2 rounded-4xl px-2  min-w-[3vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out' />
          </div>
        </div>
      </form>}

  </div>)
}

export default AddEditForm