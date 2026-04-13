import React from 'react'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import Navbar from '../../../../components/Navbar2'
import {Card} from '../../../../components/Card'
import AddSubmit from '../../../../components/AddProjSubmitForm'
import Link from 'next/link'

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
  console.log(data)
  // console.log(data.project)
  // const dev=data.project.dev.user
  const submissions = await data.project.submits
  console.log(submissions)

  return (
    <div>
      <div className='bg-gray-950 min-h-screen p-2 px-4'>
        <Navbar />
        <div className='text-white p-4'>
          <div className='flex flex-col justify-center items-center'>
            {/* <div className='text-3xl'>Project</div> */}
            <div className='text-4xl font-semibold'> {data.project.name}</div>
          </div>
          <div className='text-lg flex flex-col gap-6 py-6'>
            <div className='text-2xl'>Description
              <div className='text-lg'>{data.project.description}</div>
            </div>
            <div className='text-2xl'>Main Features
              <div className='text-lg'>{data.project.mainFeature}</div>
            </div>
            {data.project.skillsreq && <div className='text-2xl'>Skills Required
              <div className='text-lg'>{data.project.skillsreq}</div>
            </div>}
            {data.project.refrenceLink &&  <div className='text-2xl'>Refrence Links
              <div className='text-lg'><Link href={data.project.refrenceLink}>{data.project.refrenceLink}</Link></div>
            </div>}
            <div className='text-2xl'>Idea Creator :&nbsp;&nbsp;
              <Link className='bg-gray-800 hover:bg-gray-600 p-1 rounded-md text-lg' href={`/profile/${data.project.owner.user.id}`}> {data.project.owner.user.name}</Link>
            </div>
          </div>

          <div className='py-6'>
            <div className='flex gap-[70vw] items-center'>
              <div className='text-2xl'>Submissions</div>
              <div><AddSubmit title={"Add Submission"} project={false} to={'submit'} id={id} /></div>
            </div>

            <div className='flex flex-wrap py-4 gap-2'>
              {submissions.length>0 ? submissions.map((s: any, id: any) => {
                return (
                  <Card key={id} repo={s.repoLink} live={s.liveLink} devName={s.dev.user.name} devId={s.dev.user.id} />
                )
              }): <div className='py-8 text-center text-xl mx-auto'>No Submissions</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


