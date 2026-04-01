
import {cookies} from 'next/headers'
import { redirect } from 'next/navigation'
import {EditProjSubmit} from '../../../components/EditDelete'

export default async function profile() {
    const url=`${process.env.BACKEND_URL}/api/v1/profile/me`
    console.log(url)
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
    if(user.owner!=null) console.log("owner")
    if(user.dev!=null) console.log("dev")
    return (<>
    <div>Name: {user.name}</div>
    <div>Job: {user.job}</div>
    <div>Phone: {user.phone}</div>
    <div>Email: {user.email}</div>
    <div>{user.owner!=null ? <div>
        <div>Projects</div>
        {user.owner.projects.map((project:any)=>{
            return(<div key={project.name}>
                <div>Name: {project.name}</div>
                <div>Description: {project.description}</div>
                <div>Skills Required: {project.skillsreq}</div>
                <div>
                    <div><EditProjSubmit title={"Edit Project"} to={"project"} method={'PATCH'} project={true} id={project.id} EditProject={project} /></div>
                </div>
                <div>
                    <div><EditProjSubmit title={"Delete Project"} to={"project"} method={'DELETE'} project={true} id={project.id} EditProject={project} /></div>
                </div>
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
                <div>
                    <div><EditProjSubmit title={"Edit Submission"} to={"submit"} project={false} id={submit.id} EditSubmit={submit} onSuccess={true} /></div>
                </div>
                <div><div>
                    <div><EditProjSubmit title={"Delete Submission"} to={"submit"} method={'DELETE'} project={true} id={submit.id} EditProject={submit} /></div>
                </div></div>
            </div>)
        })}
    </div> : <div>No Submissions</div>}</div>
  </>
  )
}


