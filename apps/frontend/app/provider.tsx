"use client"
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { WebSocketProvider } from "@/hooks/useGlobalWebSocket";
import Navbar2 from '../components/Navbar2'

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        if (error.status == 401) {
          console.log("error: " + error)
          toast.error("Session Expired");
          router.push("/signin")
        }
      }
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        if (error.status == 401) {
          toast.error("Session Expired");
          router.push("/signup");
        }
      },
    }),
  }))
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <div className='bg-gray-950 min-h-screen p-2'>
          <Navbar2 />
          {children}
        </div>
      </WebSocketProvider>
    </QueryClientProvider>
  )
}