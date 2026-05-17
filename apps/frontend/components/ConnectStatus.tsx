"use client"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { apiFetch } from '../utils/Apifetch'

export const ConnectStatus = (props: any) => {
  const router = useRouter()
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
        method: "PUT",
        path: "/api/v1/connect",
        body: (receiverId: number) => ({ receiver_id: receiverId, status: "Rejected" }),
        toastMessage: "Connection Rejected"
      },
      disconnect: {
        method: "PUT",
        path: "/api/v1/connect",
        body: (receiverId: number) => ({ receiver_id: receiverId, status: "Disconnected" }),
        toastMessage: "Connection Disconnected"
      },
      withdraw: {
        method: "DELETE",
        path: "/api/v1/connect",
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

    async function performConnectAction(action: keyof typeof actionConfig) {
      const config = actionConfig[action]
      const response = await apiFetch(`${url}${config.path}`, {
        method: config.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config.body(props.id)),
      })

      if (response) {
        router.refresh()
        toast.success(`${config.toastMessage}`, { duration: 5000 })
      }
    }
  

  if (!props.connection) {
    return (
      <div className="p-3 flex gap-2"><button onClick={()=>{performConnectAction('connect')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Connect</button></div>
    )
  }
  switch (props.connection.status) {
    case 'Pending':
      if (props.connection.senderId == props.id) {
        return (
          <div className="p-3 flex gap-2">
            <button onClick={()=>{performConnectAction('accept')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Accept</button>
            <button onClick={()=>{performConnectAction('reject')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Reject</button>
          </div>
          
        )
      } else {
        return (
          <div className="p-3 flex gap-2">
            <button onClick={()=>{performConnectAction('withdraw')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Withdraw</button>
          </div>
        )
      }
    case 'Connected':
      return (
        <div className="p-3 flex gap-2">
          <button className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Message</button>
          <button onClick={()=>{performConnectAction('disconnect')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Disconnect</button>
        </div>
      )
    case 'Disconnected':
      return (
        <div className="p-3 flex gap-2">
          <button onClick={()=>{performConnectAction('connect')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Connect</button>
        </div>
      )
    case 'Blocked':
      return (
        <div className="p-3 flex gap-2">
          <button onClick={()=>{performConnectAction('block')}} className="border px-2 p-1 rounded-xl bg-white text-black text-base hover:bg-gray-300">Blocked</button>
        </div>
      )
  }
}