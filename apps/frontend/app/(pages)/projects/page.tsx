import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Navbar from '../../../components/Navbar2'
import { DataTable } from "../../../components/data-table"
import { columns, Project } from "../../../components/columns"

async function getData(): Promise<Project[]> {
  const cookieStore = cookies()
  // Fetch data from your API here.
  const url = process.env.BACKEND_URL || "http://localhost:3001"
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
    <div className='bg-gray-950 min-h-screen p-2 px-4'>
      <Navbar />
      <div className='text-white'>
        <div className=" mx-auto py-10 text-lg  w-[90vw] ">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  </>
  )
}


