'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/SearchBar'
import { apiFetch } from '@/utils/Apifetch'
import { useRouter } from 'next/navigation'

export default function Search() {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  const searchParams = useSearchParams()
  const dataa = searchParams.get('search') 
  console.log(dataa)
  async function search(){
    const response = await apiFetch(`${url}/api/v1/projects/search?search=${dataa}`, {
      method: `GET`, credentials: 'include', headers: { 'Content-Type': 'application/json' }
    })
    console.log(response)
    return response
  }

  const { data: response, isLoading } = useQuery({
    queryKey: ["search", dataa],
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
      <div className='mx-[6vw] text-4xl text-center font-semibold p-2'>Results for {dataa}</div>
      <SearchBar />
      <div className='mx-[8vw] flex gap-3 flex-wrap py-2 px-8'>
        {response && response.map((res:any) => (
          <div key={res.id} onClick={()=>router.push(`project/${res.id}`)} className='border p-4 rounded-2xl cursor-pointer bg-gray-900 max-w-[33%] hover:bg-gray-800'>
            <div className='text-center text-2xl'>{res.name}</div>
            <div className='text-center pb-2 text-lg line-clamp-2'>{res.mainFeature}</div>
            <div className='line-clamp-4'>{res.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}