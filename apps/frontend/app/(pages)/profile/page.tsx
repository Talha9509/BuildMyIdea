
import {cookies} from 'next/headers'
import { redirect } from 'next/navigation'
import {EditDeleteProj} from '../../../components/EditDeleteProj'
import {EditDeleteSubmit} from '../../../components/EditDeleteSubmit'
import {EditProfile} from '../../../components/EditProfile'

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
    <div><EditProfile title={"Edit Profile"} to={"profile"} method={'PATCH'}  user={user}  /></div>
    
    <div>Name: {user.name}</div>
    <div>Job: {user.job}</div>
    <div>Phone: {user.phone}</div>
    <div>Email: {user.email}</div>
    <div>Role: {user.role=="DEV" ? `Developer` : `Idea Creator`}</div>
    <div>{user.role!="OWNER" || user.role!="DEV" ? <div>
        <div>Default is Idea Creator</div>
        <div>Choose Idea Creator to give Ideas and get it built by Developers</div>
        <div>Choose Developer to build the projects given by Idea Creator</div>
        </div> : null}</div>
    <div>{user.role=="OWNER" && user.owner!=null ? <div>
        <div>Projects</div>
        {user.owner.projects.map((project:any)=>{
            return(<div key={project.name}>
                <div>Name: {project.name}</div>
                <div>Description: {project.description}</div>
                <div>Skills Required: {project.skillsreq}</div>
                <div>
                    <div><EditDeleteProj title={"Edit Project"}  method={'PATCH'}  id={project.id} EditProject={project} /></div>
                </div>
                <div>
                    <div><EditDeleteProj title={"Delete Project"} method={'DELETE'}  id={project.id}  /></div>
                </div>
            </div>
            )
        })}
    </div> : <div>No Projects</div>}</div>
    <div>{user.role=="DEV" && user.dev!=null ? <div>
        <div>Submissions</div>
        {user.dev.submissions.map((submit:any)=>{
            return(<div>
                <div>Live Link: {submit.liveLink}</div>
                <div>Repo Link: {submit.repoLink}</div>
                <div>
                    <div><EditDeleteSubmit title={"Edit Submission"} id={submit.id} EditSubmit={submit} onSuccess={true} /></div>
                </div>
                <div><div>
                    <div><EditDeleteSubmit title={"Delete Submission"} method={'DELETE'}  id={submit.id}  /></div>
                </div></div>
            </div>)
        })}
    </div> : <div>No Submissions</div>}</div>
  </>
  )
}


