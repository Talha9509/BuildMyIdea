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
      <div className='h-screen flex justify-center py-50 text-white lg:text-5xl text-2xl'>Loading...</div>
    )
  }
  return (
    <div className='text-white'>
          <div className='mx-[6vw] lg:text-4xl text-xl text-center font-semibold p-2 py-8 pb-4'>Results for {dataa}</div>
          <div className='lg:mx-[8vw] mx-[3vw] flex gap-3 flex-wrap lg:py-2 py-4 lg:px-8'>
            {response && response.map((res:any) => (
              <div key={res.id} onClick={()=>router.push(`/profile/${res.id}`)} className='border lg:p-4 p-3 rounded-2xl cursor-pointer bg-gray-900 lg:min-w-[30%] lg:max-w-[40%] min-w-[25%] max-w-[35%] hover:bg-gray-800'>
                <div className='text-center lg:text-2xl text-lg'>{res.username}</div>
                <div className='text-center line-clamp-2 lg:text-lg text-sm'><span className='font-semibold'>Role: </span>{res.role=='OWNER' ? "Idea Creator" : "Developer"}</div>
                {res.job && <div className='text-center lg:text-lg text-sm line-clamp-2'><span className='font-semibold'>Job: </span>{res.job}</div>}
              </div>
            ))}
          </div>
        </div>
    )
}