"use client"
import { useQuery } from "@tanstack/react-query"
import Navbar from '../../../../components/Navbar2'
import { Card } from '../../../../components/Card'
import AddSubmit from '@/components/AddSubmitForm'
import Link from 'next/link'

export const ProjectId = (props: any) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects/${props.id}`
  async function fetchProjectId() {
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
    console.log(data.project.submits)
    return data
  }

  const { data: data } = useQuery({
    queryKey: ["project-id"],
    queryFn: fetchProjectId,
    retry: false,
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000
  })

  return (
    <div>
      <div className='text-white p-4'>
        <div className='flex flex-col justify-center items-center pb-4'>
          <div className='lg:text-4xl text-xl font-semibold'> {data.project.name}</div>
        </div>
        <div className="border border-gray-700 mx-2 lg:px-4 px-3 rounded-2xl bg-gray-900">
          <div className='text-lg flex flex-col gap-6 lg:py-6 py-3'>
            <div className='lg:text-xl text-sm'>Description
              <div className='lg:text-base text-xs italic'>{data.project.description}</div>
            </div>
            <div className='lg:text-xl text-sm'>Main Features
              <div className='lg:text-base text-xs italic'>{data.project.mainFeature}</div>
            </div>
            {data.project.skillsreq && <div className='lg:text-xl text-sm'>Skills Required
              <div className='lg:text-base text-xs flex flex-wrap gap-2'>{data.project.skillsreq.split(",").map((skill: string) => {
                return (
                  <div key={Math.random()} className="border lg:px-2 px-1 lg:rounded-lg rounded-md bg-white text-black lg:text-base text-xs">{skill}</div>
                )
              })}</div>
            </div>}
            {data.project.refrenceLink && <div className='lg:text-xl text-xs'>Refrence Links
              <div className='lg:text-base text-xs italic'><Link href={data.project.refrenceLink}>{data.project.refrenceLink}</Link></div>
            </div>}
            <div className='lg:text-xl text-sm'>Idea Creator :&nbsp;&nbsp;
              <Link className='bg-gray-100 text-black hover:bg-gray-300 lg:p-1 px-1 rounded-md lg:text-base text-xs' href={`/profile/${data.project.owner.user.id}`}> {data.project.owner.user.name}&nbsp;</Link>
            </div>
          </div>
        </div>

        <div className='lg:py-10 lg:px-4 py-6'>
          <div className='flex   lg:gap-[70vw] gap-[20vw] items-center lg:mx-0 mx-[6vw] '>
            <div className='lg:text-2xl text-lg'>Submissions</div>
            <div><AddSubmit id={props.id} /></div>
            {/* <div><AddSubmit title={"Add Submission"} project={false} to={'submit'} id={props.id} /></div> */}
          </div>

          <div className='flex flex-wrap lg:py-12 py-4 gap-2'>
            {data.project.submits.length > 0 ? data.project.submits.map((s: any, id: any) => {
              return (
                <Card key={id} repo={s.repoLink} live={s.liveLink} contributors={s.contributors ?? []} stars={s._count?.stars ?? 0} starGiven={s.stars ?? []} id={s.id} projectId={data.project.id} />
              )
            }) : <div className='py-8 text-center lg:text-xl text-lg mx-auto'>No Submissions</div>}
          </div>
        </div>
      </div>
    </div>
  )

}