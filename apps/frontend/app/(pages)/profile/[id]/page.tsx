import {cookies} from 'next/headers'
import { redirect } from 'next/navigation'

export default async function profile ({params}:{params:{id:number}}) {
    const param=await params
    const id=param.id
    const url=`${process.env.BACKEND_URL}/api/v1/profile/${id}`
    const cookieStore=cookies()
    const response=await fetch(url,{ credentials:'include', headers:{
        cookie: (await cookieStore).toString()
    }})
    console.log(response)
    if(response.status===401){
        redirect("/signup")
    }
    const data=await response.json()
    const user=data.user
    console.log(user)
    return (<>
    <div>Name: {user.name}</div>
    <div>Job: {user.job}</div>
    <div>{user.owner!=null ? <div>
        <div>Projects</div>
        {user.owner.projects.map((project:any)=>{
            return(<div>
                <div>Name: {project.name}</div>
                <div>Description: {project.description}</div>
                <div>Skills Required: {project.skillsReq}</div>
            </div>
            )
        })}
    </div> : <div>No Projects</div>}</div>
    <div>{user.dev!=null ? <div>
        <div>Submissions</div>
        {user.dev.submissions.map((submit:any)=>{
            return(<div>
                <div>Live Link: {submit.liveLink}</div>
                <div>Repo Link: {submit.repoLink}</div>
            </div>)
        })}
    </div> : <div>No Submissions</div>}</div>
  </>
  )
}
