"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export const SearchBar = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const router = useRouter()
  const [proj, setProj] = useState(true)
  async function onsubmit(data: any) {
    if(proj === true){
      router.push(`/search/project?search=${data.search}`)
    } else {
      router.push(`/search/profile?search=${data.search}`)
    }
    // console.log(data.search)
  }
  return (
    <div className='lg:mx-[12vw] mx-[4vw] flex items-center border border-gray-500 mt-4 mb-1 rounded-lg gap-2'>
      <div className='flex items-center p-1 gap-1'>
        <div onClick={() => setProj(false)} className={`border border-gray-500 rounded-lg px-1 cursor-pointer text-[10px] lg:text-base ${proj == true ? `` : `bg-gray-200 text-black`}`}>People</div>
        <div onClick={() => setProj(true)} className={`border border-gray-500 rounded-lg px-1 cursor-pointer text-[10px] lg:text-base  ${proj == true ? `bg-gray-200 text-black` : ``}`}>Project</div>
      </div>
      <div className='w-full flex  items-center  lg:p-1'>
        <form onSubmit={handleSubmit(onsubmit)} className='flex w-full items-center gap-2'>
        <input {...register("search")} placeholder="Search People or Projects" className='focus:outline-0 lg:min-w-[50vw] min-w-[40vw] text-[10px] lg:text-base' />
        <button type='submit' className=' bg-gray-200 text-black border border-gray-500 rounded-lg px-2 cursor-pointer text-[10px] lg:text-base'>Search</button>
        </form>
      </div>
    </div>
  )
}