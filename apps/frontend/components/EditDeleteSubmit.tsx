"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import edit from '../public/edit.svg'
import Delete from '../public/delete.svg'
import Cross from '../public/cross.svg'

export const EditDeleteSubmit = (props: any) => {
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(submitSchema), defaultValues: { liveLink: "", repoLink: "" } })
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

  // console.log(errors)

  async function Edit() {
    console.log("clicked")
    setOnblur(true)

    if (props.EditSubmit) {
      console.log(props.EditSubmit)
      reset({
        liveLink: props.EditSubmit.liveLink,
        repoLink: props.EditSubmit.repoLink
      })
    }
  }
  async function onsubmit(data: any) {
    setOnLoading(true)
    const response = await fetch(`${url}/api/v1/submit/${props.id}`, {
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

    {/* <div className='border p-2'><button onClick={props.method === 'DELETE' ? onsubmit : Edit}>{props.title}</button></div> */}

    <button onClick={props.method === 'DELETE' ? onsubmit : Edit} className='flex gap-1  p-1 cursor-pointer rounded-2xl font-medium bg-gray-800 hover:bg-gray-600 text-white items-center'><div className=' text-black'>
      {props.method=='DELETE' ? <Image src={Delete} width={15} alt='Delete'></Image> : <Image src={edit} width={15} alt='Edit'></Image>}
      </div></button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black '>
          <div className='flex flex-col p-8 gap-2 bg-white rounded-2xl  relative'>

            {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

            <div className='relative'>
            <button className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl p-2 text-center'>{props.title}</div>

            <div className='flex flex-col gap-1'>
              <div>
              <div>Live Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none w-80 ' {...register("liveLink")} /></div>
              {errors.liveLink && <div  className='text-sm px-2'>{errors.liveLink.message}</div>}
              </div>

              <div>
              <div>Repo Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none w-80 ' {...register("repoLink")} /></div>
              {errors.repoLink && <div  className='text-sm px-2'>{errors.repoLink.message}</div>}
              </div>
            </div>

            <input type="submit" className={`border-black border-2 rounded-4xl px-2 my-2   min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} />
          </div>
        </div>
      </form>}

  </div>)
}