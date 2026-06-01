"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { apiFetch } from '@/utils/Apifetch'
import { useRouter } from 'next/navigation'

export const SearchProfile = (props: any) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  const searchParams = useSearchParams()
  const dataa = searchParams.get('search') 
  console.log(dataa)
  async function search(){
    const response = await apiFetch(`${url}/api/v1/profile/search?search=${dataa}`, {
      method: `GET`, credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })
    console.log(response)
    return response
  }

  const { data: response, isLoading } = useQuery({
    queryKey: ["search-profile", dataa],
    queryFn: search,
    retry: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0
  })

  if(isLoading){
    return(
      <div className='h-screen flex justify-center py-50 text-white text-5xl'>Loading...</div>
    )
  }
  return (
    <div className='text-white'>
          <div className='mx-[6vw] text-4xl text-center font-semibold p-2 py-8 pb-4'>Results for {dataa}</div>
          <div className='mx-[8vw] flex gap-3 flex-wrap py-2 px-8'>
            {response && response.map((res:any) => (
              <div key={res.id} onClick={()=>router.push(`/profile/${res.id}`)} className='border p-4 rounded-2xl cursor-pointer bg-gray-900 min-w-[30%] max-w-[40%] hover:bg-gray-800'>
                <div className='text-center text-2xl'>{res.username}</div>
                <div className='text-center text-lg line-clamp-2'><span className='font-semibold'>Role: </span>{res.role=='OWNER' ? "Idea Creator" : "Developer"}</div>
                {res.job && <div className='text-center text-lg line-clamp-2'><span className='font-semibold'>Job: </span>{res.job}</div>}
              </div>
            ))}
          </div>
        </div>
    )
}