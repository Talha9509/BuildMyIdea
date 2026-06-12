"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGlobalWebSocket } from '@/hooks/useGlobalWebSocket'
import { apiFetch } from '@/utils/Apifetch'
import { format } from 'date-fns';

export default function page() {
  const { socket } = useGlobalWebSocket();
  const params = useParams()
  const receiverId = params.id
  const queryClient = useQueryClient()
  const [text, setText] = useState('')

  async function getPrevMessages() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await apiFetch(`${url}/api/v1/chats/${receiverId}`, {
      method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })
    console.log(response)
    const messageHistory = await response.messageHistory
    const receiverName = response.receiverName.name
    const isConnected = response.Connected
    console.log("messages "+messageHistory)
    console.log("connected "+isConnected)
    return {messageHistory, receiverName, isConnected}
  }

  const { data, isLoading } = useQuery({
    queryKey: ["chat", receiverId],
    queryFn: getPrevMessages,
    retry: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (!socket) return
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        console.log("messages" + JSON.stringify(data))
        queryClient.setQueryData(["chat", receiverId], (oldData: any) => {
          console.log("old: "+JSON.stringify(oldData.messageHistory))
          return { ...oldData,
            messageHistory: [...(oldData.messageHistory || []), {message: data.message, receiverId: data.receiverId, createdAt: data.createdAt, id: Date.now() }]
           }
        })
      }
    }
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage)
  }, [socket, receiverId, queryClient])

  const sendMessage = (e:any) => {
    e.preventDefault();
        if (!text.trim() || !socket) return;

        const newMessage = {
            type: "message",
            receiverId: receiverId,
            message: text
        };
        socket.send(JSON.stringify(newMessage));
        
        // Optimistically add YOUR message to the screen immediately
        queryClient.setQueryData(['chat', receiverId], (oldData: any) => {
            return { ...oldData,
              messageHistory: [...(oldData.messageHistory || []), { createdAt: Date.now(), message: text, id: Date.now(), receiverId: receiverId }]}
        });
        setText("");
  }

  if (!isLoading && data && data?.isConnected==false) {
    return (
      <div className='h-screen flex flex-col gap-2 p-8 items-center justify-center text-center text-4xl text-white'>
        <div>404</div>
        <div>Page Not Found</div>
        </div>
    )
  }

  const receiverName = data?.receiverName
  const messages = data?.messageHistory
  console.log(messages)

  return (
    <div>
      {(isLoading ) ? <div className='text-3xl text-white flex items-center justify-center h-screen'>Loading...</div> 
      :
      <div>
      <div className='text-3xl text-white text-center pt-2'>{receiverName}</div>
      <div className="border-gray-300 border-t my-4" />
      <div className="flex-1 overflow-y-auto p-4 pb-16 space-y-1">
        {messages.length > 0 && messages.map((msg: any) => (
          <div key={msg.id} className={msg.receiverId == receiverId ? "text-right" : "text-left"}>
            <span className="inline-block px-2 py-1 rounded bg-gray-200">
              {msg.message}
            <span className='text-[10px] pl-2'>{format(msg.createdAt, 'hh:mm a')}</span>
            </span>
          </div>
        ))}
      </div>
      </div>
      }
      <div>

      {!isLoading && <form onSubmit={sendMessage} className="p-2 bg-gray-950 fixed bottom-0 left-0 right-0">
        <div className='flex px-4'>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className=" text-black bg-white w-full rounded-l-lg border p-2 focus:outline-none focus:ring-2 focus:ring-[#FF3511]"
          />
          <button onClick={sendMessage} className='bg-[#f72500] text-gray-100 px-4 rounded-r-lg cursor-pointer font-semibold text-lg hover:bg-[#a01800]'>Send</button>
          </div>
      </form>}
          </div>
    </div>
  )
}