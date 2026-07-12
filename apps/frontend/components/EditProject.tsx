"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProjectSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import edit from '../public/edit.svg'
import Cross from '../public/cross.svg'
import { toast } from 'sonner'
import { apiFetch } from '@/utils/Apifetch'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const EditProject = (props: any) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(updateProjectSchema), defaultValues: { name: "", description: "", skillsreq: "",mainFeature:"", refrenceLink:"" } })
  const [onblur, setOnblur] = useState(false)
  const url = process.env.NEXT_PUBLIC_BACKEND_URL 
  // const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
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
    console.log(errors)
    setOnblur(true)

      reset({
        name: props.EditProject.name,
        description: props.EditProject.description,
        skillsreq: props.EditProject.skillsreq,
        mainFeature: props.EditProject.mainFeature,
        refrenceLink: props.EditProject.refrenceLink,
      })
  }

  async function editProject(formData:any) {
    const response = await apiFetch(`${url}/api/v1/projects/${props.id}`, {
      method: `PATCH`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    return response
  }

   const updateProjectMutation = useMutation({
      mutationFn: editProject,
      onSuccess: () => {
        setOnblur(false)
        queryClient.invalidateQueries({ queryKey: ['profile-me']})
        toast.success("Project Edited", { duration: 5000 });
      }
    })

  async function onsubmit(data: any) {
    updateProjectMutation.mutate(data)
  }
  return (<div>
    <button onClick={ Edit } className='flex gap-1  p-1 cursor-pointer rounded-2xl font-medium bg-gray-800 hover:bg-gray-600 text-black items-center'><div className=' text-black'>
      <Image src={edit} className='lg:w-4 w-3 text-white' alt='Edit'></Image>
      </div></button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 gap-2 bg-white rounded-2xl relative'>

            <div className='relative'>
            <button className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl text-center'>Edit Project</div>

            <div className='flex flex-col gap-1'>
              
              <div>
                <div>Name: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[20vw]' {...register("name")} /></div>
              {errors.name && <div  className='text-sm px-2'>{errors.name.message}</div>}
              </div>

              <div>
              <div>Description <div><textarea className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none w-full' {...register("description")} rows={3} /></div></div>
              {errors.description && <div className='text-sm px-2'>{errors.description.message}</div>}
              </div>

              <div>
                <div>Main Feature <div><input className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none w-full' {...register("mainFeature")} placeholder='Important Feature of Project' /></div></div>
                {errors?.mainFeature && <div className='text-sm px-2'>{errors.mainFeature.message}</div>}
              </div>

              <div>
                <div>Refrence Link <span className='text-xs text-gray-500'>(optional)</span><div><input className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none w-full' {...register("refrenceLink")} placeholder='Any Refrence for the Project' /></div></div>
              </div>

              <div>
              <div>Skills required <div><textarea className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none w-full' {...register("skillsreq")} rows={1} placeholder='Enter Skills with comma in between' /></div></div>
              {/* <div className='text-sm'>Write Skills with comma in between</div> */}
              </div>
            </div>

            <button type="submit" disabled={updateProjectMutation.isPending} className={`disabled:bg-blue-400 border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} >{updateProjectMutation.isPending ? "Updating..." : "Submit"}</button>
          </div>
        </div>
      </form>}

  </div>)
}
