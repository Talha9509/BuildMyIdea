"use client"
import { toast } from 'sonner'
import { apiFetch } from '../utils/Apifetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export const ConnectStatus = (props: any) => {
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
      body: (receiverId: number) => ({ receiver_id: receiverId, status: "Connected" }),
      toastMessage: "Connection Accepted"
    },
    reject: {
      method: "DELETE",
      path: "/api/v1/connect/reject",
      body: (receiverId: number) => ({ receiver_id: receiverId, status: "Rejected" }),
      toastMessage: "Connection Rejected"
    },
    disconnect: {
      method: "DELETE",
      path: "/api/v1/connect/disconnect",
      body: (receiverId: number) => ({ receiver_id: receiverId, status: "Disconnected" }),
      toastMessage: "Connection Disconnected"
    },
    // reconnect: {
    //   method: "PUT",
    //   path: "/api/v1/connect",
    //   body: (receiverId: number) => ({ receiver_id: receiverId, status: "Pending" }),
    //   toastMessage: "Connection Pending"
    // },
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
      toastMessage: "Blocked"
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
    onSuccess: (_data,action) => {
      const config = actionConfig[action]
      queryClient.invalidateQueries({ queryKey: ["profile-id", props.id] })
      if(config != actionConfig['withdraw']){
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
      <div className="p-3 flex gap-2"><button onClick={() => { performConnectAction('connect') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Connect</button></div>
    )
  }
  switch (props.connection.status) {
    case 'Pending':
      if (props.connection.senderId == props.id) {
        return (
          <div className="p-3 flex gap-2">
            <button onClick={() => { performConnectAction('accept') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Accept</button>
            <button onClick={() => { performConnectAction('reject') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Reject</button>
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
        <div className="p-3 flex gap-2">
          <Link href={`/chat/${props.id}`} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Message</Link>
          <button onClick={() => { performConnectAction('disconnect') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Disconnect</button>
        </div>
      )
    case 'Blocked':
      return (
        <div className="p-3 flex gap-2">
          <button onClick={() => { performConnectAction('block') }} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300 cursor-pointer">Block</button>
        </div>
      )
  }
}