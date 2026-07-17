import React from 'react'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { SubmitId } from './SubmitId'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function page({ params }: { params: { id: number } }) {
  const queryClient = new QueryClient()
  const param = await params
  const id = await param.id
  const cookieStore = cookies()

  async function fetchSubmitId() {
    const url = process.env.BACKEND_URL
    const response = await fetch(`${url}/api/v1/submit/${id}`, {
      credentials: 'include', headers: {
        cookie: (await cookieStore).toString()
      }
    })
    if (response.status === 401) {
      console.log("error")
      redirect("/signin")
    }
    const data = await response.json()
    console.log(data)
    // console.log(data.project)
    // const dev=data.project.dev.user
    const submit = data.submit
    console.log(submit)
    const isMember = submit.contributors.some((t: any) => t.dev.user.id === data.userId)
    const isOwner = submit.project.owner.userId == data.userId
    const hasBounty = submit.project.bounty > 0
    
    return { submit, isMember, isOwner, hasBounty }
  }

  const res = await queryClient.prefetchQuery({
    queryKey: ["submit-id", id],
    queryFn: fetchSubmitId
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubmitId id={id} />
    </HydrationBoundary>
  )
}
