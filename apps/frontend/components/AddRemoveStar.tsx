"use client"
import { useState, useEffect, type MouseEvent } from 'react'
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

    const stopLinkNavigation = (event: MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
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
  
  async function popup(event?: MouseEvent<HTMLElement>) {
    if (event) {
      stopLinkNavigation(event)
    }
    setOnblur(true)
  }

  async function AddRemove(event?: MouseEvent<HTMLElement>){
    if (event) {
      stopLinkNavigation(event)
    }
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
      <button type='button' onClick={(event) => popup(event)} className='flex gap-1 cursor-pointer bg-gray-900 hover:bg-gray-800  lg:py-1 lg:px-2 px-1 py-1 rounded-sm'>
        {(props.starGiven && props.starGiven.length == 0) ?
          <Image src={nostar} alt='No Star' className='lg:w-4 w-3' />
          :
          <Image src={star} alt='Star' className='lg:w-4 w-3' />
        }
      <div className='lg:text-sm text-xs'>{props.stars}</div>
      </button>

      {onblur && <div>
      <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
        <div className='flex flex-col lg:mx-0 mx-[3vw] lg:p-5 p-2 bg-white rounded-2xl relative border-2 border-black'>
          {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

          {props.starGiven == 0 ? <div className='text-2xl text-center p-4'>Are you sure you want to Add Star to the Submission?</div>
          :
          <div className='lg:text-2xl text-xl text-center lg:p-4 p-3'>Are you sure you want to Remove Star from the Submission?</div>}

          <div className='flex gap-2  justify-end'>
            {props.starGiven == 0 ? <button type='button' onClick={(event) => AddRemove(event)} className='border-black border rounded-lg lg:px-3 lg:py-2 py-1 px-1 cursor-pointer bg-gray-800 hover:bg-gray-950 text-white lg:text-xl text-sm transition duration-300 ease-in-out' >Add Star
            </button> :
            <button type='button' onClick={(event) => AddRemove(event)} className='border-[#c4192e] border rounded-lg p-2 py-1 cursor-pointer bg-[#c4192e] hover:bg-red-950 text-white text-lg transition duration-300 ease-in-out' >Delete Star
            </button> }
            <button type='button' onClick={(event) => { stopLinkNavigation(event); setOnblur(false) }} className='border-gray-500 border rounded-lg lg:px-3 lg:py-2 py-1 px-1 cursor-pointer bg-white hover:bg-gray-300 text-black lg:text-xl text-sm transition duration-300 ease-in-out' >Cancel
            </button>
          </div>
        </div>
      </div>
    </div>}

    </div>
  )
}