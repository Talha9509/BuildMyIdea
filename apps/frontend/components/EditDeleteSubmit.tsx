"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

    <div className='border p-2'><button onClick={props.method === 'DELETE' ? onsubmit : Edit}>{props.title}</button></div>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black '>
          <div className='flex flex-col p-8 bg-white relative'>

            {onLoading && <div className=' absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-sm z-40 bg-gray-200/10 text-black'>Loading...</div>}

            <button onClick={() => setOnblur(false)}>close</button>
            <div className='text-2xl'>{props.title}</div>

            <div>
              <div>Live Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("liveLink")} /></div>
              {errors.liveLink && <div>{errors.liveLink.message}</div>}

              <div>Repo Link: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("repoLink")} /></div>
              {errors.repoLink && <div>{errors.repoLink.message}</div>}
            </div>

            <input type="submit" className={`border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} />
          </div>
        </div>
      </form>}

  </div>)
}