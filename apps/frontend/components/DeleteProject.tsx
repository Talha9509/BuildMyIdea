"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Delete from '../public/delete.svg'
import { toast } from 'sonner'
import { apiFetch } from '@/utils/Apifetch'
import { DeleteIcon } from './Icons/DeleteIcon'

export const DeleteProject = (props: any) => {
  const router = useRouter()
  const [onblur, setOnblur] = useState(false)
  const [onLoading, setOnLoading] = useState(false)
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

  async function deleteProject() {
    setOnblur(true)
  }

  async function onsubmit() {
    setOnLoading(true)
    const response = await apiFetch(`${url}/api/v1/projects/${props.id}`, {
      method: `DELETE`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })

    setOnLoading(false)
    if (response) {
      setOnblur(false)
      router.refresh()
      toast.success("Project Deleted", { duration: 5000 });
    }

  }
  return (<div>
    <button onClick={deleteProject} className='flex gap-1  p-1 cursor-pointer rounded-2xl font-medium bg-gray-800 hover:bg-gray-600 text-black items-center'><div className=' text-black'>
      {/* <Image src={Delete} className='lg:w-4 w-3' alt='Delete'></Image> */}
      <DeleteIcon className='lg:w-4 w-3 text-white' />
    </div></button>

    {onblur && <div>
      <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
        <div className='flex flex-col lg:mx-0 mx-[3vw] lg:p-5 p-2 bg-white rounded-2xl relative border-2 border-black'>
          {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Deleting...</div>}

          <div className='lg:text-2xl text-xl text-center lg:p-4 p-3'>Are you sure you want to delete? It will be removed permanently.</div>

          <div className='flex gap-2  justify-end'>
            <button onClick={onsubmit} className='border-[#c4192e] border rounded-lg lg:px-3 lg:py-2 py-1 px-1 cursor-pointer bg-[#c4192e] hover:bg-red-950 text-white lg:text-xl text-sm transition duration-300 ease-in-out' >Delete
            </button>
            <button onClick={() => setOnblur(false)} className='border-gray-500 border rounded-lg lg:px-3 lg:py-2 py-1 px-1 cursor-pointer bg-white hover:bg-gray-300 text-black lg:text-xl text-sm transition duration-300 ease-in-out' >Cancel
            </button>
          </div>
        </div>
      </div>
    </div>}

  </div>)
}
