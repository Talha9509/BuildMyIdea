"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Plus from '../public/plus.svg'
import Cross from '../public/cross.svg'
import { toast } from 'sonner'
import { apiFetch } from '../utils/Apifetch'

const AddProjectForm = () => {
  const router = useRouter()
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(ProjectSchema), defaultValues: { name: "", description: "", mainFeature: "", compensationType: "equity", bounty: undefined, equity: undefined } })

  const [onLoading, setOnLoading] = useState(false)
  const [onblur, setOnblur] = useState(false)
  // const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  const compensationType = watch("compensationType")

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

  async function Add() {
    setOnblur(true)
    reset({
      name: "",
      description: "",
      skillsreq: undefined,
      mainFeature: "",
      refrenceLink: undefined,
      compensationType: "equity",
      bounty: undefined,
      equity: undefined
    })

  }

  async function onsubmit(data: any) {
    setOnLoading(true)
    const newUrl = `${url}/api/v1/projects`
    const response = await apiFetch(`${newUrl}`, {
      method: `POST`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    })

    setOnLoading(false)
    // if (response) {
    //   setOnblur(false)
    //   // next: use usestate to add a new project
    //   router.refresh()
    //   toast.success("Project Added", { duration: 5000 });
    // }
    if (response.type === "equity") {
      setOnblur(false);
      router.refresh();
      toast.success("Project Added");
    }
    else if (response.type === "bounty") {
      console.log("orderId: "+response.orderId)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: response.amount,
        order_id: response.orderId,
        name: "BuildMyIdea",
        description: "Bounty Escrow",
        handler: function (razorpayResponse: any) {
          setOnblur(false);
          router.refresh();
          toast.success("Payment successful! Project is now live");
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (res: any)  => {
        console.error("Payment Failed Reason:", res.error.description);
        toast.error("Payment failed. Please try again.");
      })
      rzp.open();
    }
  }
  return (<div>
    <button onClick={Add} className='flex gap-1 border lg:px-2 px-1 lg:py-1 cursor-pointer lg:rounded-lg rounded-sm lg:font-medium font-normal bg-gray-100 hover:bg-gray-300 text-black items-center lg:text-base text-xs'><div className=' text-black'><Image src={Plus} alt='Plus' className='lg:w-4 w-3'></Image></div>Add Project</button>

    {onblur &&
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-6  gap-2 bg-white rounded-2xl relative max-h-[95vh] overflow-y-auto custom-scrollbar'>

            {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>}

            <div className='relative'>
              <button className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl p-1 text-center'>Add Project</div>

            <div className='flex flex-col gap-1'>
              <div><div>Name: <input className='border-black border-2 rounded-lg px-2 focus:outline-none min-w-[20vw]' {...register("name")} placeholder='Name of Project' /></div>
                {errors?.name && <div className='text-sm px-2'>{errors.name.message}</div>}
              </div>

              <div><div>Description <div><textarea className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none  w-full' {...register("description")} rows={3} placeholder='Describe the Project Procedure and Key Functionality' /></div></div>
                {errors?.description && <div className='text-sm px-2'>{errors.description.message}</div>}
              </div>

              <div><div>Main Feature <div><input className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none  w-full' {...register("mainFeature")} placeholder='Important Feature of Project' /></div></div>
                {errors?.mainFeature && <div className='text-sm px-2'>{errors.mainFeature.message}</div>}
              </div>

              <div>
                <div className='flex gap-1 items-center pt-2'>
                  <button className={`border-2 p-1 px-2 rounded-2xl ${compensationType == "equity" ? `border-blue-950 text-blue-950 bg-blue-100` : ``}`} type='button' onClick={() => setValue("compensationType", "equity")}>Equity</button>
                  <button type='button' className={`border-2 p-1 px-2 rounded-2xl ${compensationType == "bounty" ? `border-blue-950 text-blue-950 bg-blue-100` : ``} `} onClick={() => setValue("compensationType", "bounty")}>Bounty</button>
                  <div>
                    {compensationType === "equity" && (<div>
                      < input type="number" className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-900 w-full' {...register("equity")} placeholder='Equity Percentage(%)' />
                      {errors?.equity && <div className='text-sm  px-2' > {errors.equity.message as string} </div>}
                    </div>)}

                    {compensationType === "bounty" && (<div>
                      < input type="number" className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-900 w-full' {...register("bounty")} placeholder='Bounty Amount(₹)' />
                      {errors?.bounty && <div className='text-sm px-2' > {errors.bounty.message as string} </div>
                      }
                    </div>)}
                  </div>
                </div>
              </div>
              <div>Note: {compensationType == 'bounty' ? `Bounty can't be refunded or changed` : `Equity can't be changed`}</div>

              <div><div>Refrence Link <span className='text-xs text-gray-500'>(optional)</span><div><input className='border-black border-2 rounded-lg  px-2 py-1 focus:outline-none  w-full' {...register("refrenceLink")} placeholder='Any Refrence for the Project' /></div></div>
              </div>

              <div><div>Skills required <span className='text-xs text-gray-500'>(optional)</span><div><textarea className='border-black border-2 rounded-lg  px-2 py-1  focus:outline-none  w-full' {...register("skillsreq")} rows={1} placeholder='Enter Skills with comma in between' /></div></div>
                {/* <div className='text-sm'>Write Skills with comma in between</div> */}
              </div>

            </div>

            <input type="submit" className='border-black border-2 rounded-4xl px-2  min-w-[3vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out' />
          </div>
        </div>
      </form>}

  </div>)
}

export default AddProjectForm