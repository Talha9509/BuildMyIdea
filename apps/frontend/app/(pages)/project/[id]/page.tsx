import React from 'react'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { Button } from '@/components/Button'
import { DataTable } from "../../../../components/data-table"
import { SubmissionColumn } from "../../../../components/columns"
import Navbar from '../../../../components/Navbar2'
import Card from '../../../../components/Card'

export default async function page({ params }: { params: { id: number } }) {
  const param = await params
  const id = await param.id
  console.log(id)
  const cookieStore = cookies()

  const url = process.env.BACKEND_URL || "http://localhost:3001"
  const response = await fetch(`${url}/api/v1/project/${id}`, {
    credentials: 'include', headers: {
      cookie: (await cookieStore).toString()
    }
  })
  if (response.status === 401) {
    console.log("error")
    redirect("/signin")
  }
  if (response.status === 500) {
    console.log("server error")
  }

  const data = await response.json()
  // console.log(data.project)
  // const dev=data.project.dev.user
  const submissions = await data.project.submits
  console.log(submissions)
  
  return (
    <div>
    <div className='bg-gray-950 min-h-screen p-2 px-4'>
      <Navbar />
      <div className='text-white'>
          <div>Project</div>
          <div>Name: {data.project.name}</div>
          <div>Owner: {data.project.owner.user.name}</div>
          <div>Description: {data.project.description}</div>
       
          <div>Submissions</div>
          <div><Button name={"Add Submission"} /></div>
          {/* <DataTable columns={SubmissionColumn} data={submissions} /> */}
          {submissions.map((s:any, id:any)=>{
            return(
              <Card key={id} repo={s.repoLink} live={s.liveLink} devName={s.dev.user.name} devId={s.dev.user.id} />
            )
          })}
          {/* <Card  repo={submissions[0].repoLink} live={submissions[0].liveLink} devName={submissions[0].dev.user.name} devId={submissions[0].dev.user.id} /> */}
        </div>
      </div>
    </div>
  )
}


