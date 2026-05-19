import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MyProfile } from './myProfile'

export default async function profile() {
  const url = `${process.env.BACKEND_URL}/api/v1/profile/me`
  console.log(url)
  const cookieStore = cookies()
  const queryClient = new QueryClient()

  async function fetchProfile() {
    const response = await fetch(url, {
      credentials: 'include', headers: {
        cookie: (await cookieStore).toString()
      }
    })
    console.log(response)
    if (response.status === 401) {
      console.log(response.status)
      redirect("/signin")
    }
    const data = await response.json()
    const user = data.user
    return user
  }

  const res = await queryClient.prefetchQuery({
    queryKey: ["profile-me"],
    queryFn: fetchProfile
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyProfile />
    </HydrationBoundary>
  )
}


