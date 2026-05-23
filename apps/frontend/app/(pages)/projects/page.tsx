
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Navbar from '../../../components/Navbar2'
import { DataTable } from "../../../components/data-table"
import { ProjectColumns, Project } from "../../../components/columns"
import AddProject from '../../../components/AddProjSubmitForm'

async function getData(): Promise<Project[]> {
  const cookieStore = cookies()
  // Fetch data from your API here.
  // const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001" 
  const url = process.env.BACKEND_URL 
  const response = await fetch(`${url}/api/v1/projects`, {
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
  // console.log(response)
  const data = await response.json()
  //   console.log(data)
  const projects = data.projects
  console.log(projects)
  return projects
}

export default async function page() {
  const data = await getData()

  return (<>
      <div className='text-white'>
        <div className='flex gap-[60vw] items-center mx-[8vw]'>
          <div className='text-4xl font-semibold'>Projects</div>
          <div><AddProject title={"Add Project"} to={"projects"} project={true} /></div>
        </div>
        <div className=" mx-auto py-2 pb-20 text-lg table-fixed  w-[90vw] ">
          {/* <Table data={data} /> */}
          <DataTable columns={ProjectColumns} data={data} />
        </div>
      </div>
  </>
  )
}


