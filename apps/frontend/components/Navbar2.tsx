"use client";
import { useEffect, useState } from "react";
import Link from 'next/link'
import Logout from '../components/Logout'
import { apiFetch } from "@/utils/Apifetch";
import { toast } from "sonner";
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useGlobalWebSocket } from '@/hooks/useGlobalWebSocket'
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation'

const Navbar2 = () => {
  const pathname = usePathname();
  const hiddenRoutes = ['/signin', '/signup', '/'];
  if (hiddenRoutes.includes(pathname) || pathname.startsWith("/chat")) return null;
  const { socket, isConnected } = useGlobalWebSocket();
  const queryClient = useQueryClient()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const router = useRouter()
  // const [notifications, setNotifications] = useState([])
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  async function getPrevNotifications() {
    const response = await apiFetch(`${url}/api/v1/notifications`, {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })

    // if (response) {
    //   const notify = response.notifications
    //   console.log(notify)
    //   // setNotifications(notify)
    // }
    // return {notifications: response.notifications}
    const notificationss = response.notifications
    // console.log("notifications " + JSON.stringify(notificationss))
    return notificationss
  }

  const { data: notifications } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: getPrevNotifications,
    retry: false,
    staleTime: 15 * 60 * 1000,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (!socket) return
    const handleMessage = (event: MessageEvent) => {
      const parsed = JSON.parse(event.data)
      if (parsed.type === 'notification') {
        console.log("parsed data: " + JSON.stringify(parsed))
        queryClient.setQueryData(['unread-notifications'], (oldData: any) => {
          console.log("oldData: " + JSON.stringify(oldData))
          if (!oldData) {
            console.log("new notification")
            toast.info(`${parsed.data}`, { duration: 5000 })
            return [{ message: (parsed.data), id: Date.now(), createdAt: Date.now(), senderId: Number(parsed.senderId) }]
          }
          console.log("sender" + parsed.sender)
          toast.info(`${(parsed.data)}`, { duration: 5000 })
          return [{ message: (parsed.data), id: Date.now(), createdAt: Date.now(), senderId: Number(parsed.senderId) }, ...oldData]
            ;
        });
      }
    }
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage)
  }, [socket, queryClient])

  return (
    <div>
      <div className='flex justify-around lg:min-h-[10vh] min-h-[5vh] items-center'>
        <Link href={"/"}>
          <div className='text-xl lg:text-3xl font-bold font-mono'><span className='text-[#d4d3d3]'>BuildMy</span><span className='text-[#FF3511]'>Idea</span></div>
        </Link>
        <div className='flex lg:gap-2 gap-1 items-center'>
          <div className="relative">
            <button onClick={() => setNotificationOpen(!notificationOpen)} className="lg:px-4 lg:py-1 px-1 lg:rounded-4xl rounded-lg lg:text-base text-xs font-semibold bg-gray-100 hover:bg-gray-300 cursor-pointer"> Notifications </button>

            {notificationOpen && (
              <div className="mt-2 bg-white shadow rounded-lg p-3 absolute z-10 w-70 flex flex-col left-1/2 -translate-x-1/2 max-h-[50vh] overflow-y-auto">
                {notifications && notifications.length !== 0 ? notifications.map((notify: any) => (
                  <div key={notify.id} onClick={() => { setNotificationOpen(false); router.push(`/profile/${notify.senderId}`) }} className="mb-1 text-black hover:bg-gray-200 p-1 px-2 rounded-lg cursor-pointer">
                    <div>{notify.message}</div>
                    <div className="text-xs text-gray-500">{format(notify.createdAt, 'dd/MM hh:mm a')}</div>
                  </div>
                ))
                  : <div className="text-center">No Notifications</div>}
              </div>
            )}
          </div>
          <div>
            <Link href={"/profile"} className='lg:px-4 lg:py-1 px-1 lg:rounded-4xl rounded-lg font-semibold bg-[#FF3511] lg:text-base text-xs'>Profile</Link>
          </div>
          <div>
            <Link href={"/projects"} className='lg:px-4 lg:py-1 px-1 hidden lg:block lg:rounded-4xl rounded-lg font-semibold bg-[#FF3511] text-gray-900 lg:text-base text-xs'>Projects</Link>
          </div>
          <Logout ></Logout>
        </div>
      </div>
    </div>
  )
}

export default Navbar2
