"use client"
import { EditProfile } from '../../../components/EditProfile'
import { Tab } from '../../../components/Tab'
import { Card } from '../../../components/Card'
import { useQuery } from '@tanstack/react-query'

export const MyProfile = () => {
  console.log("myprofile")
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/profile/me`

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
    const user = data.user
    console.log(user)
    return user
  }

  const { data: user, isLoading, isFetching } = useQuery({
    queryKey: ["profile-me"],
    queryFn: fetchProfile,
    retry: false,
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000
  })
  return (
    <div>
    {user && <div className='px-4'>
      <div className='flex justify-center items-center gap-6'>
        <div className='text-center lg:text-4xl text-xl p-4 px-10 font-semibold'>Profile</div>
        <div><EditProfile title={"Edit"} to={"profile"} method={'PATCH'} user={user} /></div>
      </div>

      <div className='flex flex-col items-center'>
        <div>
          <div className='lg:text-lg text-sm grid grid-cols-2 justify-center   lg:gap-x-10'>
            <div>Username: {user.username}</div>
            <div>Name: {user.name}</div>
            <div>Job: {user.job}</div>
            <div>Phone: {user.phone}</div>
            <div>Role: {user.role == "DEV" ? `Developer` : user.role == "OWNER" ? `Idea Creator` : 'None'}</div>
            <div>Connections: {user._count.receivers + user._count.senders}</div>
            <div>Email: {user.email}</div>
          </div>
          <div className='lg:text-sm text-xs'>{user.role != "OWNER" && user.role != "DEV" ?
            <div className='py-4 lg:text-lg text-sm'>
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
            <div className='lg:text-2xl text-xl py-4'>Your Projects</div>
            <div className='flex flex-wrap lg:gap-4 gap-2'>
              {user.owner.projects.map((project: any) => (
                <Tab key={project.id} project={project} />
              ))}
            </div>
          </div>) : (<div className='lg:px-10 px-5 py-10 lg:py-20 text-2xl'>No Projects</div>)
      ) : null}
      {/* </div> */}

      {/* <div className='py-6'> */}
      {user.role === "DEV" ? (
        user.dev?.contributions?.length ? (
          <div className='py-6'>
            <div className='lg:text-2xl text-xl py-4'>Your Submissions</div>
            <div className='flex flex-wrap gap-4'>
              {/* {user.dev.submissions.map((submit: any) => (
                <Card key={submit.id} repo={submit.repoLink} live={submit.liveLink} submit={submit} personalProfile={true} id={submit.id} project={submit.project} starGiven={submit.stars}
                  stars={submit._count.stars}
                />
              ))} */}
              {user.dev.contributions.map((contribution: any) => {
                    const submission = contribution?.submission
                    if (!submission) return null
                    return (
                      <Card key={submission.id} repo={submission.repoLink} live={submission.liveLink} personalProfile={true} project={submission.project} stars={submission._count?.stars ?? 0} starGiven={submission.stars} id={submission.id} />
                    )
              })}
            </div>
          </div>) : (<div className='px-10 py-20 text-2xl'>No Submissions</div>)
      ) : null}
      {/* </div> */}

    </div>}
    </div>
  )
}