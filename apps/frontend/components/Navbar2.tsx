"use client";
import { useEffect, useState } from "react";
import Link from 'next/link'
import Logout from '../components/Logout'
import { apiFetch } from "@/utils/Apifetch";
import { toast } from "sonner";

const Navbar2 = () => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  async function getPrevNotifications() {
    const response = await apiFetch(`${url}/api/v1/notifications`, {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })

    if (response) {
      const notify = response.notifications
      console.log(notify)
      setNotifications(notify)
    }
  }
  
  // remove useeffect as it feetches on every page
  useEffect(() => {
    getPrevNotifications()
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data)
      console.log(parsed)
      // @ts-ignore
      setNotifications([parsed.data, ...notifications])
      toast.info(`${parsed.data}`, { duration: 5000 })
    }
    return () => {
      ws.close();
    };
  }, [])

  return (
    <div>
      <div className='flex justify-around min-h-[10vh] items-center'>
        <Link href={"/"}>
          <div className='text-3xl font-bold font-mono'><span className='text-[#d4d3d3]'>BuildMy</span><span className='text-[#FF3511]'>Idea</span></div>
        </Link>
        <div className='flex gap-2 items-center'>
          {/* {!notificationOpen ? <button onClick={()=>setNotificationOpen(!notificationOpen)} className='px-4 py-1 rounded-4xl font-semibold bg-gray-100 hover:bg-gray-300'>Notifications</button>
            :
            <div>
              <button onClick={()=>setNotificationOpen(!notificationOpen)} className='px-4 py-1 rounded-4xl font-semibold bg-gray-100 hover:bg-gray-300'>Notifications</button>
              <div>{notifications && notifications.map((notify: any) => (
                <div key={notify.id} className="top-2 left-2  flex text-black relative">
                  <div className=" bg-white">
                    <div>{notify.message}<span className="text-xs">{notify.createdAt}</span></div>
                  </div>
                </div>
              ))}</div>
            </div>} */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="px-4 py-1 rounded-4xl font-semibold bg-gray-100 hover:bg-gray-300"
            >
              Notifications
            </button>

            {notificationOpen && (
              <div className="mt-2 bg-white shadow rounded-lg p-3">
                {/* {notifications.map((notify: any) => (
                  <div key={notify.id} className="mb-2 text-black">
                    <div>{notify.message}</div>
                    <div className="text-xs text-gray-500">{notify.createdAt}</div>
                  </div>
                ))} */}
              </div>
            )}
          </div>
          <Link href={"/profile"} className='px-4 py-1 rounded-4xl font-semibold bg-[#FF3511]'>Profile</Link>
          <Logout ></Logout>
        </div>
      </div>
    </div>
  )
}

export default Navbar2
