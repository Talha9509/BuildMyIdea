"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export const SearchBar = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const router = useRouter()
  const [proj, setProj] = useState(true)
  async function onsubmit(data: any) {
    router.push(`/search?search=${data.search}`)
    // console.log(data.search)
  }
  return (
    <div className='mx-[12vw] flex border border-gray-500 mt-4 mb-1 rounded-lg gap-2'>
      <div className='flex p-1 gap-1'>
        <div onClick={() => setProj(false)} className={`border border-gray-500 rounded-lg px-1 cursor-pointer ${proj == true ? `` : `bg-gray-200 text-black`}`}>People</div>
        <div onClick={() => setProj(true)} className={`border border-gray-500 rounded-lg px-1 cursor-pointer  ${proj == true ? `bg-gray-200 text-black` : ``}`}>Project</div>
      </div>
      <div className='w-full flex justify-between p-1'>
        <form onSubmit={handleSubmit(onsubmit)}>
        <input {...register("search")} placeholder="Search People or Projects" className='focus:outline-0 min-w-[50vw]' />
        <button type='submit' className=' bg-gray-200 text-black border border-gray-500 rounded-lg px-2 cursor-pointer'>Search</button>
        </form>
      </div>
    </div>
  )
}