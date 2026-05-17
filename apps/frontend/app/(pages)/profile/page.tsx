
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EditProfile } from '../../../components/EditProfile'
import { Tab } from '../../../components/Tab'
import {Card} from '../../../components/Card'

export default async function profile() {
  const url = `${process.env.BACKEND_URL}/api/v1/profile/me`
  console.log(url)
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
  if (user.owner != null) console.log("owner")
  if (user.dev != null) console.log("dev")

  return (<div className='px-4'>
    <div className='flex justify-center items-center gap-6'>
      <div className='text-center text-4xl p-4 px-10 font-semibold'>Profile</div>
      <div><EditProfile title={"Edit"} to={"profile"} method={'PATCH'} user={user} /></div>
    </div>

    <div className='flex flex-col items-center'>
      <div>
        <div className='text-lg grid grid-cols-2 justify-center  gap-x-10'>
          <div>Name: {user.name}</div>
          <div>Job: {user.job}</div>
          <div>Phone: {user.phone}</div>
          <div>Email: {user.email}</div>
          <div>Role: {user.role == "DEV" ? `Developer` : user.role == "OWNER" ? `Idea Creator` : 'None'}</div>
          <div>Connections: {user._count.receivers+user._count.senders}</div>
        </div>
        <div className='text-sm'>{user.role != "OWNER" && user.role != "DEV" ? 
          <div className='py-4 text-lg'>
          <div>In Role option, choose between</div>
          <div><span className='font-bold underline'>Idea Creator</span> to give Ideas and get it built by Developers</div>
          <div><span className='font-bold underline'>Developer</span> to build the projects given by Idea Creator</div>
        </div> : null}</div>
      </div>
    </div>

    {/* <div className=' py-6'> */}
      {user.role === "OWNER" ? (
        user.owner?.projects?.length ? (
          <div className='py-6'>
            <div className='text-2xl py-4'>Your Projects</div>
            <div className='flex flex-wrap gap-4'>
              {user.owner.projects.map((project: any) => (
                <Tab key={project.id} project={project} />
              ))}
            </div>
          </div>) : ( <div className='px-10 py-20 text-2xl'>No Projects</div> )
      ) : null}
    {/* </div> */}

    {/* <div className='py-6'> */}
      {user.role === "DEV" ? (
        user.dev?.submissions?.length ? (
          <div className='py-6'>
            <div className='text-2xl py-4'>Your Submissions</div>
            <div className='flex flex-wrap gap-4'>
              {user.dev.submissions.map((submit: any) => (
                <Card key={submit.id} repo={submit.repoLink} live={submit.liveLink} submit={submit}  personalProfile={true} id={submit.id} project={submit.project} starGiven={submit.stars}
                 stars={submit._count.stars}
                   />
              ))}
            </div>
          </div>) : ( <div className='px-10 py-20 text-2xl'>No Submissions</div> )
      ) : null}
    {/* </div> */}

  </div>
  )
}


