"use client"
import { EditProject } from './EditProject'
import { DeleteProject } from './DeleteProject'
import Link from 'next/link'

// for personal profile, with edit and delete options
export const Tab = (props: any) => {
  return (
    <div className=' hover:bg-gray-950 bg-gray-900 rounded-2xl'>
      <div className='border border-white flex max-w-[40vw]  gap-4 justify-between p-4 rounded-2xl'>
        <Link key={props.project.id} href={`/project/${props.project.id}`}>
          <div>
            <div className='flex flex-col gap-1 max-w-[30vw]'>
              <div>Name: {props.project.name}</div>
              <div className='line-clamp-2'>Description: {props.project.description}</div>
              <div className='line-clamp-2'>Main Features: {props.project.mainFeature}</div>
              <div className='line-clamp-1'>Refrence Link: {props.project.refrenceLink}</div>
              <div className='line-clamp-1'>Skills Required: {props.project.skillsreq}</div>
            </div>
          </div>
        </Link>
         <div className='flex gap-1 flex-col'>
          <div><EditProject id={props.project.id} EditProject={props.project} /></div>
          <div><DeleteProject id={props.project.id} /></div>
        </div>
      </div>
    </div>
  )
}

// for others profile, without edit and delete options
export const Tab2 = (props: any) => {
  return (
    <div className=' hover:bg-gray-950 bg-gray-900 rounded-2xl border border-white'>
      <div className=' flex max-w-[30vw] min-w-[25vw]  gap-4 justify-between p-4 rounded-2xl'>
        <Link key={props.project.id} href={`/project/${props.project.id}`}>
          <div>
            <div className='flex flex-col gap-1 '>
              <div>Name: {props.project.name}</div>
              <div className='line-clamp-2'>Description: {props.project.description}</div>
              <div className='line-clamp-1'>Main Features: {props.project.mainFeature}</div>
              <div className='line-clamp-1'>Refrence Link: {props.project.refrenceLink}</div>
              <div className='line-clamp-1'>Skills Required: {props.project.skillsreq}</div>
            </div>
          </div>
        </Link>
        
      </div>
    </div>
  )
}

