"use client"
import { EditProfile } from '../../../../components/EditProfile'
import { Card } from '../../../../components/Card'
import { useQuery } from '@tanstack/react-query'
import { Tab2 } from '../../../../components/Tab'
import { ConnectStatus } from '@/components/ConnectStatus'

export const ProfileId = (props:any) => {
  console.log("myprofile")
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/profile/${props.id}`
  console.log(url)
  async function fetchProfile() {
    const response = await fetch(url, {
      credentials: 'include'
    })
    if (response.status === 401) {
      console.log("error: " + response)
      const error: any = new Error('Unauthorized')
      error.status = 401
      throw error
    }
    const data = await response.json()
    console.log(data)
    const user = data.user
    console.log("users count "+user._count)
    const connections = data.connections
    console.log(connections)
    return {user,connections}
  }


  const { data } = useQuery({
    queryKey: ["profile-id", props.id],
    queryFn: fetchProfile,
    retry: false,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000
  })

  const user = data?.user
  console.log("user: "+user)
  const connections = data?.connections
  return (
    <div>
    {user && <div className='px-6'>
        <div className='flex justify-center items-center gap-6'>
          <div className='text-center text-5xl py-2 px-10 font-semibold'>Profile</div>
        </div>
        <div className='flex justify-center items-center gap-6 text-xl'>
          <ConnectStatus connection={connections} id={props.id} />
        </div>
        <div className='flex justify-center items-center gap-6 text-xl'>
          <div>Name: {user.name}</div>
          {user.job && user.job.trim() != "" ? <div>Job: {user.job}</div> : ""}
          <div>Role: {user.role == "DEV" ? `Developer` : `Idea Creator`}</div>
          <div>Connections: {user._count.senders+user._count.receivers}</div>
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
                    <Card key={submit.repoLink} repo={submit.repoLink} live={submit.liveLink} profile={true} project={submit.project} stars={submit._count.stars} Profile={true} starGiven={submit.stars} id={submit.id}  />
                  ))}
                </div>
              </div>
            ) : (
              <div className='px-10 py-20 text-2xl'>No Submissions</div>
            )
          ) : null}
    
      </div>}
      </div>
  )
}