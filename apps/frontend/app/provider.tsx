"use client"
import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        if (error.status == 401) {
          console.log("error: " + error)
          toast.error("Session Expires");
          router.push("/signin")
        }
      }
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        if (error.status == 401) {
          toast.error("Session Expires");
          router.push("/signup");
        }
      },
    }),
  }))
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}