"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import edit from '../public/edit.svg'
import Cross from '../public/cross.svg'
import { toast } from 'sonner'
import { apiFetch } from '@/utils/Apifetch'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const EditSubmit = (props: any) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(submitSchema), defaultValues: { liveLink: "", repoLink: "" } })
  const [onblur, setOnblur] = useState(false)
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
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
    setOnblur(true)

    reset({
      liveLink: props.EditSubmit.liveLink,
      repoLink: props.EditSubmit.repoLink
    })
  }

  async function editSubmission(formData:any) {
    const response = await apiFetch(`${url}/api/v1/submit/${props.id}`, {
      method: `PATCH`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    return response
  }

   const updateSubmitMutation = useMutation({
      mutationFn: editSubmission,
      onSuccess: () => {
        setOnblur(false)
        queryClient.invalidateQueries({ queryKey: ['profile-me']})
        toast.success("Submission Edited", { duration: 5000 });
      }
    })

  async function onsubmit(data: any) {
    updateSubmitMutation.mutate(data)
  }
  return (<div>
    <button onClick={Edit} className='flex gap-1  p-1 cursor-pointer rounded-2xl font-medium bg-gray-800 hover:bg-gray-600 text-white items-center'><div className=' text-black'>
      <Image src={edit} className='lg:w-4 w-3' alt='Edit'></Image>
    </div></button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black '>
          <div className='flex flex-col lg:p-8 p-3 lg:mx-0 mx-[3vw] gap-2 bg-white rounded-2xl  relative'>

            <div className='relative'>
              <button className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl p-2 text-center'>Edit Submit</div>

            <div className='flex flex-col gap-1'>
              <div>
                <div>Live Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none w-80 ' {...register("liveLink")} /></div>
                {errors.liveLink && <div className='text-sm px-2'>{errors.liveLink.message}</div>}
              </div>

              <div>
                <div>Repo Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none w-80 ' {...register("repoLink")} /></div>
                {errors.repoLink && <div className='text-sm px-2'>{errors.repoLink.message}</div>}
              </div>
            </div>

            <button type="submit" disabled={updateSubmitMutation.isPending} className={`disabled:bg-blue-400 border-black border-2 rounded-4xl px-2 my-2   min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} >{updateSubmitMutation.isPending ? 'Updating...' : 'Submit'}</button>
          </div>
        </div>
      </form>}

  </div>)
}