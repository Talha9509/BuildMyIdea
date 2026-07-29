"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardDevSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import Cross from '../public/cross.svg'
import { apiFetch } from '@/utils/Apifetch'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const AddAccountIdForm = (props: any) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ resolver: zodResolver(onboardDevSchema), defaultValues: { contact_name: "", email: "", phone: undefined, legal_business_name: "",   } })
  const [onblur, setOnblur] = useState(false)
  //   const role = watch("role")

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

  async function Edit() {
    setOnblur(true)
    reset({
      contact_name: "",
      email: undefined,
      phone: undefined,
      legal_business_name: "",
    })
  }

  async function AddAccount(formData: any) {
    const response = await apiFetch(`${url}/api/v1/payments/onboard-dev`, {
      method: `${props.method}`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    if (response == null) {
      throw new Error("error")
    }
    return response
  }

  const updateProfileMutation = useMutation({
    mutationFn: AddAccount,
    onSuccess: () => {
      setOnblur(false)
      queryClient.invalidateQueries({ queryKey: ['profile-me'] })
      console.log("response ok")
      toast.success("Account Details Added", { duration: 5000 });
    }
  })

  console.log(errors)
  async function onsubmit(data: any) {
    updateProfileMutation.mutate(data)
  }
  return (<div>
    <button onClick={Edit} disabled={props.accountId != null} className='flex gap-1 border lg:px-2 px-1 cursor-pointer lg:rounded-lg rounded-sm   bg-gray-100 disabled:bg-gray-400 hover:bg-gray-300 text-black items-center lg:font-medium font-normal lg:text-base text-xs'>Link Account</button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8 bg-white gap-2 rounded-2xl relative'>

            <div className='relative'>
              <button className=' absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl text-center'>Link Account</div>

            <div className='flex flex-col gap-2'>
              <div>
                <div>Name: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[12vw]' {...register("contact_name")} /></div>
                {errors.contact_name && <div className='text-sm px-2'>{errors.contact_name?.message}</div>}
              </div>

              <div>
                <div>Email: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[12vw]' {...register("email")} /></div>
                {errors.email && <div className='text-sm px-2'>{errors.email?.message}</div>}
              </div>

              <div>
                <div>Phone: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[12vw]' {...register("phone")} /></div>
                {errors.phone && <div className='text-sm px-2'>{errors.phone?.message}</div>}
              </div>

              <div>
                <div>Business Name: <input className='border-black border-2 rounded-xl px-2 focus:outline-none min-w-[10vw]' {...register("legal_business_name")} /></div>
                {errors.legal_business_name && <div className='text-sm px-2'>{errors.legal_business_name?.message}</div>}
              </div>
              <div>Note: You can't Edit these details again</div>
            </div>

            <button type="submit" disabled={updateProfileMutation.isPending} className={`disabled:bg-blue-400 border-black border-2 rounded-4xl px-2  min-w-[5vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out`} >{updateProfileMutation.isPending ? "Updating..." : "Submit"}</button>
          </div>
        </div>
      </form>}

  </div>)
}
