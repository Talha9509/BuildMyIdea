"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiFetch } from '@/utils/Apifetch'
import Image from 'next/image'
import star from '../public/star.svg'
import nostar from '../public/no-star.svg'

export const AddRemoveStar = (props:any) => {
  console.log("stars given "+props.starsGiven)
    const router = useRouter()
    const [onblur, setOnblur] = useState(false)
    const [onLoading, setOnLoading] = useState(false)
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
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
  
  async function popup() {
    setOnblur(true)
  }

  async function AddRemove(){
    setOnLoading(true)
    const response = await apiFetch(`${url}/api/v1/star/${props.projectId}/${props.id}`, {
      method: `${props.starGiven.length == 0 ? `PUT` : `DELETE`}`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })

    setOnLoading(false)
    if (response) {
      setOnblur(false)
      router.refresh()
      {props.starGiven.length == 0 ? toast.success("Star Added", { duration: 5000 }) : 
     toast.success("Star Removed", { duration: 5000 }) }
    }
  }

  return(
    <div>
      <button onClick={popup} className='flex gap-1 cursor-pointer bg-gray-900 hover:bg-gray-800  p-1 px-2 rounded-sm'>
        {(props.starGiven && props.starGiven.length == 0) ?
          <Image src={nostar} alt='No Star' />
          :
          <Image src={star} alt='Star'  />
        }
      <div className='text-sm'>{props.stars}</div>
      </button>

      {onblur && <div>
      <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
        <div className='flex flex-col p-5 bg-white rounded-2xl relative border-2 border-black'>
          {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

          {props.starGiven == 0 ? <div className='text-2xl text-center p-4'>Are you sure you want to Add Star to the Submission?</div>
          :
          <div className='text-2xl text-center p-4'>Are you sure you want to Remove Star from the Submission?</div>}

          <div className='flex gap-2  justify-end'>
            {props.starGiven == 0 ? <button onClick={AddRemove} className='border-black border rounded-lg p-2 py-1 cursor-pointer bg-gray-800 hover:bg-gray-950 text-white text-lg transition duration-300 ease-in-out' >Add Star
            </button> :
            <button onClick={AddRemove} className='border-[#c4192e] border rounded-lg p-2 py-1 cursor-pointer bg-[#c4192e] hover:bg-red-950 text-white text-lg transition duration-300 ease-in-out' >Delete Star
            </button> }
            <button onClick={() => setOnblur(false)} className='border-gray-500 border rounded-lg p-2 py-1 cursor-pointer bg-white hover:bg-gray-300 text-black text-lg transition duration-300 ease-in-out' >Cancel
            </button>
          </div>
        </div>
      </div>
    </div>}

    </div>
  )
}