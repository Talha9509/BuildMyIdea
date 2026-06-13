"use client"
import { toast } from 'sonner'
import { apiFetch } from '../utils/Apifetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

export const ConnectStatus = (props: any) => {
  const [blur, setBlur] = useState(false)
  const queryClient = useQueryClient()
  const url = process.env.NEXT_PUBLIC_BACKEND_URL

  const actionConfig = {
    connect: {
      method: "POST",
      path: "/api/v1/connect",
      body: (receiverId: number) => ({ receiver_id: receiverId, status: 'Pending' }),
      toastMessage: "Connection Request Sent"
    },
    accept: {
      method: "PUT",
      path: "/api/v1/connect",
      body: (senderId: number) => ({ sender_id: senderId, status: "Connected" }),
      toastMessage: "Connection Accepted"
    },
    reject: {
      method: "DELETE",
      path: "/api/v1/connect/reject",
      body: (senderId: number) => ({ sender_id: senderId, status: "Rejected" }),
      toastMessage: "Connection Rejected"
    },
    disconnect: {
      method: "DELETE",
      path: "/api/v1/connect/disconnect",
      body: (receiverId: number) => ({ receiver_id: receiverId, status: "Disconnected" }),
      toastMessage: "Connection Disconnected"
    },
    withdraw: {
      method: "DELETE",
      path: "/api/v1/connect/withdraw",
      body: (receiverId: number) => ({ receiver_id: receiverId }),
      toastMessage: "Connection Withdrawn"
    },
    block: {
      method: "POST",
      path: "/api/v1/connect/block",
      body: (receiverId: number) => ({ receiver_id: receiverId }),
      toastMessage: `Blocked ${props.name}`
    },
  }

  async function a(action: keyof typeof actionConfig) {
    const config = actionConfig[action]
    const response = await apiFetch(`${url}${config.path}`, {
      method: config.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config.body(props.id)),
    })
    return response
  }

  const updateConnectStatus = useMutation({
    mutationFn: a,
    onSuccess: (_data, action) => {
      const config = actionConfig[action]
      queryClient.invalidateQueries({ queryKey: ["profile-id", props.id] })
      if (config != actionConfig['withdraw']) {
        console.log("send toast")
        toast.success(`${config.toastMessage}`, { duration: 7000 })
      }
    }
  })

  async function performConnectAction(data: any) {
    updateConnectStatus.mutate(data)
  }


  if (!props.connection || props.connection == null || Object.keys(props.connection).length === 0 || !props.connection.status) {
    return (
      <div className="lg:px-3 lg:py-3 py-2 flex gap-2">
        <button onClick={() => { performConnectAction('connect') }} className="border px-1 lg:px-2 lg:py-1 lg:rounded-xl rounded-md bg-white text-black lg:text-base text-xs hover:bg-gray-300 cursor-pointer">Connect</button>
      </div>
    )
  }
  switch (props.connection.status) {
    case 'Pending':
      if (props.connection.senderId == props.id) {
        return (
          <div className="lg:px-3 lg:py-3 py-2 flex gap-2">
            <button onClick={() => { performConnectAction('accept') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Accept</button>
            <button onClick={() => { performConnectAction('reject') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Reject</button>
            <button onClick={() => { setBlur(true) }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Block</button>
            {blur && <div className='h-screen w-screen  bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
              <div className='flex flex-col p-8  gap-2 bg-white rounded-2xl relative'>
                <div className='text-2xl text-center p-4'>Are you sure you want to Block {props.name}?</div>
                <div className='flex gap-2  justify-end'>
                  <button onClick={() => performConnectAction('block')} className='border-[#c4192e] border rounded-lg p-3 py-2 cursor-pointer bg-[#c4192e] hover:bg-red-950 text-white text-xl transition duration-300 ease-in-out'>Block</button>
                  <button onClick={() => setBlur(false)} className='border-gray-500 border rounded-lg p-3 py-2 cursor-pointer bg-white hover:bg-gray-300 text-black text-xl transition duration-300 ease-in-out'>Cancel</button>
                </div>
              </div>
            </div>}
          </div>
        )
      } else {
        return (
          <div className="p-3 flex gap-2">
            <button onClick={() => { performConnectAction('withdraw') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Withdraw</button>
          </div>
        )
      }
    case 'Connected':
      return (
        <div className="lg:px-3 lg:py-3 py-2 flex gap-2">
          <Link href={`/chat/${props.id}`} className="border  px-1 lg:px-2 lg:py-1 lg:rounded-xl rounded-md bg-white text-black text-base hover:bg-gray-300">Message</Link>
          <button onClick={() => { performConnectAction('disconnect') }} className="border px-1 lg:px-2 lg:py-1 lg:rounded-xl rounded-md bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Disconnect</button>
          <button onClick={() => { performConnectAction('block') }} className="border px-1 lg:px-2 lg:py-1 lg:rounded-xl rounded-md bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Block</button>
          {blur && <div className='h-screen w-screen  bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
              <div className='flex flex-col p-8  gap-2 bg-white rounded-2xl relative'>
                <div className='text-2xl text-center p-4'>Are you sure you want to Block {props.name}?</div>
                <div className='flex gap-2  justify-end'>
                  <button onClick={() => performConnectAction('block')} className='border-[#c4192e] border rounded-lg p-3 py-2 cursor-pointer bg-[#c4192e] hover:bg-red-950 text-white text-xl transition duration-300 ease-in-out'>Block</button>
                  <button onClick={() => setBlur(false)} className='border-gray-500 border rounded-lg p-3 py-2 cursor-pointer bg-white hover:bg-gray-300 text-black text-xl transition duration-300 ease-in-out'>Cancel</button>
                </div>
              </div>
            </div>}
        </div>
      )
    case 'Blocked':
      return (
        <div className="p-3 flex gap-2">
          <button className="border px-2 p-1 rounded-xl bg-gray-400 text-black text-base cursor-not-allowed">Connect</button>
        </div>
      )
  }
}