import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Tab2 } from '../../../../components/Tab'
import {Card} from '../../../../components/Card'

export default async function profile({ params }: { params: { id: number } }) {
  const param = await params
  const id = param.id
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/profile/${id}`
  const cookieStore = cookies()
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
  console.log(user)
  // console.log(user.owner.projects)
  // console.log(user.owner.projects.length)
  return (<div className='px-6'>
    <div className='flex justify-center items-center gap-6'>
      <div className='text-center text-5xl py-2 px-10 font-semibold'>Profile</div>
    </div>
    <div className='flex justify-center items-center gap-6 text-xl'>
      <div>Name: {user.name}</div>
      {user.job && user.job.trim() != "" ? <div>Job: {user.job}</div> : ""}
      <div>Role: {user.role == "DEV" ? `Developer` : `Idea Creator`}</div>
    </div>

      {user.role === "OWNER" ? (
        user.owner?.projects?.length ? (
          <div className='py-10'>
            <div className='text-3xl py-4'>Projects</div>
            <div className='flex flex-wrap gap-4'>
              {user.owner.projects.map((project: any) => (
                <Tab2 key={project.name} project={project} id={project.id} />
              ))}
            </div>
          </div>
        ) : (
          <div className='px-10 py-20 text-2xl'>No Projects</div>
        )
      ) : null}

      {user.role === "DEV" ? (
        user.dev?.submissions?.length ? (
          <div className='py-10'>
            <div className='text-3xl py-4'>Submissions</div>
            <div className='flex flex-wrap gap-4'>
              {user.dev.submissions.map((submit: any) => (
                <Card key={submit.repoLink} repo={submit.repoLink} live={submit.liveLink} profile={true} />
              ))}
            </div>
          </div>
        ) : (
          <div className='px-10 py-20 text-2xl'>No Submissions</div>
        )
      ) : null}

  </div>
  )
}
