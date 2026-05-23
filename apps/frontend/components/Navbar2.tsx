"use client";
import { useEffect, useState } from "react";
import Link from 'next/link'
import Logout from '../components/Logout'
import { apiFetch } from "@/utils/Apifetch";
import { toast } from "sonner";
import { QueryClient, useQuery } from '@tanstack/react-query'

const Navbar2 = () => {
  const queryClient = new QueryClient()
  const [notificationOpen, setNotificationOpen] = useState(false)
  // const [notifications, setNotifications] = useState([])
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  async function getPrevNotifications() {
    const response = await apiFetch(`${url}/api/v1/notifications`, {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })

    if (response) {
      const notify = response.notifications
      console.log(notify)
      // setNotifications(notify)
    }
    return response.notifications
  }

  const { data: notifications } = useQuery({
    queryKey: ['unread- notifucations'],
    queryFn: getPrevNotifications
  })

  // remove useeffect as it feetches on every page
  useEffect(() => {
    // getPrevNotifications()
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === 'notification') {
        queryClient.setQueryData(['unread-notifications'], (oldData: any) => {
          if (!oldData || !oldData.notifications) {
            toast.info(`${parsed.data}`, { duration: 5000 })
            return { notifications: [parsed.data] };
          }
          return {
            notifications: [parsed.data, ...oldData.notifications]
          };
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient])

  return (
    <div>
      <div className='flex justify-around min-h-[10vh] items-center'>
        <Link href={"/"}>
          <div className='text-3xl font-bold font-mono'><span className='text-[#d4d3d3]'>BuildMy</span><span className='text-[#FF3511]'>Idea</span></div>
        </Link>
        <div className='flex gap-2 items-center'>
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="px-4 py-1 rounded-4xl font-semibold bg-gray-100 hover:bg-gray-300"
            >
              Notifications
            </button>

            {notificationOpen && (
              <div className="mt-2 bg-white shadow rounded-lg p-3 absolute z-10 w-70 flex flex-col left-1/2 -translate-x-1/2">
                {notifications.length !== 0 ? notifications.map((notify: any) => (
                  <div key={notify.id} className="mb-1 text-black">
                    <div>{notify.message}</div>
                    <div className="text-xs text-gray-500">{
                      // notify.createdAt.split("-")[1]}:{notify.createdAt.split("-")[0]
                      notify.createdAt}</div>
                  </div>
                ))
              : <div className="text-center">No Notifications</div>}
              </div>
            )}
          </div>
          <Link href={"/profile"} className='px-4 py-1 rounded-4xl font-semibold bg-[#FF3511]'>Profile</Link>
          <Link href={"/projects"} className='px-4 py-1 rounded-4xl font-semibold bg-[#FF3511] text-gray-900'>Projects</Link>
          <Logout ></Logout>
        </div>
      </div>
    </div>
  )
}

export default Navbar2
