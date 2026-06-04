"use client"
import { useQuery } from "@tanstack/react-query"
import Navbar from '../../../../components/Navbar2'
import { Card } from '../../../../components/Card'
import AddSubmit from '../../../../components/AddProjSubmitForm'
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
    console.log(data)
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
          <div className='text-4xl font-semibold'> {data.project.name}</div>
        </div>
        <div className="border border-gray-700 mx-2 px-4 rounded-2xl bg-gray-900">
        <div className='text-lg flex flex-col gap-6 py-6'>
          <div className='text-xl'>Description
            <div className='text-base'>{data.project.description}</div>
          </div>
          <div className='text-xl'>Main Features
            <div className='text-base'>{data.project.mainFeature}</div>
          </div>
          {data.project.skillsreq && <div className='text-xl'>Skills Required
            <div className='text-base flex gap-2'>{data.project.skillsreq.split(",").map((skill:string)=>{
            return (
              <div className="border px-2 rounded-lg bg-white text-black">{skill}</div>
            )
            })}</div>
          </div>}
          {data.project.refrenceLink && <div className='text-xl'>Refrence Links
            <div className='text-base'><Link href={data.project.refrenceLink}>{data.project.refrenceLink}</Link></div>
          </div>}
          <div className='text-xl'>Idea Creator :&nbsp;&nbsp;
            <Link className='bg-gray-100 text-black hover:bg-gray-300 p-1 rounded-md text-base' href={`/profile/${data.project.owner.user.id}`}> {data.project.owner.user.name}&nbsp;</Link>
          </div>
        </div>
        </div>

        <div className='py-10 px-4'>
          <div className='flex gap-[70vw] items-center'>
            <div className='text-2xl'>Submissions</div>
            <div><AddSubmit title={"Add Submission"} project={false} to={'submit'} id={props.id} /></div>
          </div>

          <div className='flex flex-wrap py-12 gap-2'>
            {data.project.submits.length > 0 ? data.project.submits.map((s: any, id: any) => {
              return (
                <Card key={id} repo={s.repoLink} live={s.liveLink} devName={s.dev.user.name} devId={s.dev.user.id} stars={s._count.stars} starGiven={s.stars} id={s.id} projectId={data.project.id} />
              )
            }) : <div className='py-8 text-center text-xl mx-auto'>No Submissions</div>}
          </div>
        </div>
      </div>
    </div>
  )

}