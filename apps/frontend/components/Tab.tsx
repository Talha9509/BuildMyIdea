"use client"
import { EditProject } from './EditProject'
import { DeleteProject } from './DeleteProject'
import Link from 'next/link'

// for personal profile, with edit and delete options
export const Tab = (props: any) => {
  return (
    <div>
      <div className='border border-white flex lg:max-w-[40vw] max-w-[45vw]  lg:gap-4 gap-2 justify-between lg:p-4 p-3 rounded-2xl hover:bg-gray-950 bg-gray-900 '>
        <Link key={props.project.id} href={`/project/${props.project.id}`}>
          <div>
            <div className='flex flex-col gap-1 lg:max-w-[30vw] max-w-[28vw]'>
              <div className='text-center lg:text-2xl text-lg lg:font-semibold font-medium pb-2'>{props.project.name}</div>
              <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Main Features:</span> {props.project.mainFeature}</div>
              <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Description:</span> {props.project.description}</div>
              {props.project.refrenceLink && <div className='line-clamp-1'><span className='font-bold'>Refrence Link:</span> {props.project.refrenceLink}</div>}
              {props.project.skillsreq && <div className='line-clamp-1'><span className='font-bold'>Skills Required:</span> {props.project.skillsreq}</div>}
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
      <div className=' flex lg:max-w-[30vw] lg:min-w-[25vw] min-w-[20vw] max-w-[42vw] gap-4 justify-between lg:p-4 p-3 rounded-2xl'>
        <Link key={props.project.id} href={`/project/${props.project.id}`}>
          <div>
            <div className='flex flex-col gap-1 '>
              <div className='text-center lg:text-xl text-lg lg:font-semibold font-medium lg:pb-1 pb-2'>{props.project.name}</div>
              <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Main Features:</span> {props.project.mainFeature}</div>
              <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Description:</span> {props.project.description}</div>
              {props.project.refrenceLink && <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Refrence Link:</span> {props.project.refrenceLink}</div>}
              {props.project.skillsreq && <div className='line-clamp-2 lg:text-base text-sm'><span className='font-bold'>Skills Required:</span> {props.project.skillsreq}</div>}
            </div>
          </div>
        </Link>
        
      </div>
    </div>
  )
}

