"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGlobalWebSocket } from '@/hooks/useGlobalWebSocket'
import { apiFetch } from '@/utils/Apifetch'
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter()
  const { socket } = useGlobalWebSocket();
  const params = useParams()
  const receiverId = params.id
  const queryClient = useQueryClient()
  const [text, setText] = useState('')
  const [notConnected,setNotConnected] = useState(false)

  async function getPrevMessages() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await apiFetch(`${url}/api/v1/chats/${receiverId}`, {
      methode: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })
    console.log(response)
    if(!response.notConnected){
      console.log("not connected")
      setNotConnected(true)
    }
    const messageHistory = await response.messageHistory
    const receiverName = response.receiverName.name
    console.log("messages "+messageHistory)
    console.log("name "+receiverName)
    return {messageHistory, receiverName}
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

  const receiverName = data?.receiverName
  const messages = data?.messageHistory
  console.log(messages)
  if(notConnected){
   router.push(`/profile/${receiverId}`)
  }

  return (
    <div>
      {(isLoading ) ? <div className='text-3xl text-white flex items-center justify-center h-screen'>Loading...</div> 
      :
      <div>
      <div className='text-3xl text-white text-center pt-2'>{receiverName}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length > 0 && messages.map((msg: any) => (
          <div key={msg.id} className={msg.receiverId == receiverId ? "text-right" : "text-left"}>
            <span className="inline-block px-2 py-1 rounded bg-gray-200">
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      </div>
      }
      
      {!isLoading && <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
      </form>}
    </div>
  )
}