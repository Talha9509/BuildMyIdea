import React from 'react'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { ProjectId } from './ProjectId'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function page({ params }: { params: { id: number } }) {
  const queryClient = new QueryClient()
  const param = await params
  const id = await param.id
  const cookieStore = cookies()

  async function fetchProjectId() {
    const url = process.env.BACKEND_URL
    const response = await fetch(`${url}/api/v1/projects/${id}`, {
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
    const submissions = await data.project.submits
    console.log(submissions)
    return data
  }

  const res = await queryClient.prefetchQuery({
    queryKey: ["project-id"],
    queryFn: fetchProjectId
  })



  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectId id={id} />
    </HydrationBoundary>
  )
}


