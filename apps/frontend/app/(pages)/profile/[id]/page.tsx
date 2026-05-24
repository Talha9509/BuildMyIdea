import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileId } from './ProfileId'

export default async function profile({ params }: { params: { id: number } }) {
  const queryClient = new QueryClient()
  const param = await params
  const id = param.id
  const url = `${process.env.BACKEND_URL}/api/v1/profile/${id}`
  const cookieStore = cookies()

  async function fetchProfile() {
    const response = await fetch(url, {
      credentials: 'include', headers: {
        cookie: (await cookieStore).toString()
      }
    })
    console.log(response)
    if (response.status === 401) {
      redirect("/signup")
    }
    const data = await response.json()
    const user = data.user
    console.log(data)
    console.log(user)
    const connections = data.connections
    console.log("connections "+JSON.stringify(connections))
    return {connections, user}
  }

  const res = await queryClient.prefetchQuery({
    queryKey: ["profile-id"],
    queryFn: fetchProfile
  })

  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileId id={id} />
    </HydrationBoundary>
  )
}
