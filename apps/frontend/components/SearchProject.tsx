"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { apiFetch } from '@/utils/Apifetch'
import { useRouter } from 'next/navigation'

export const SearchProject = (props: any) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  const searchParams = useSearchParams()
  const dataa = searchParams.get('search') 
  console.log(dataa)
  console.log("project")
  async function search(){
    const response = await apiFetch(`${url}/api/v1/projects/search?search=${dataa}`, {
      method: `GET`, credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })
    console.log(response)
    return response
  }

  const { data: response, isLoading } = useQuery({
    queryKey: ["search-project", dataa],
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
          <div className='lg:mx-[8vw] mx-[2vw] flex lg:gap-3 gap-1 flex-wrap lg:py-2 py-4 lg:px-8'>
            {response && response.map((res:any) => (
              <div key={res.id} onClick={()=>router.push(`/project/${res.id}`)} className='border lg:p-4 p-3 rounded-2xl cursor-pointer bg-gray-900 lg:max-w-[32%] max-w-[45%] hover:bg-gray-800'>
                <div className='text-center lg:text-2xl text-lg font-semibold pb-4'>{res.name}</div>
                <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Main Features:</span> {res.mainFeature}</div>
                <div className='line-clamp-4 lg:text-base text-sm'><span className='font-bold'>Description:</span> {res.description}</div>
              </div>
            ))}
          </div>
        </div>
    )
}