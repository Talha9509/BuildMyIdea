"use client"
import Link from 'next/link'
import {EditDeleteSubmit} from './EditDeleteSubmit'

export const Card = (props: any) => {
  console.log(props.repo)
  return (
    <div>
      <div className='flex'>
        <div className='text-white border p-4 min-w-[20vw] rounded-2xl flex flex-col gap-1'>
          {!props.profile && <div>Name:&nbsp;<Link className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md' href={`/profile/${props.devId}`}>{props.devName}</Link></div>}
          <div>Repo Link: <a href={`${props.repo}`} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md'>{props.repo}</a></div>
          <div>Live Link: <a href={`${props.repo}`} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md'>{props.live}</a></div>
        </div>
      </div>
    </div>
  )
}

export const Card2=(props:any)=>{
  console.log("submit "+props.submit)
  return(<div>
    <div className='bg-gray-900'>
      <div className='flex border p-4 min-w-[25vw] gap-4 justify-between rounded-2xl'>
        <div className='text-white  flex flex-col gap-1'>
          {!props.profile && <div>Name:&nbsp;<Link className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md' href={`/profile/${props.devId}`}>{props.devName}</Link></div>}
          <div>Repo Link: <a href={`${props.repo}`} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md truncate'>{props.repo}</a></div>
          <div>Live Link: <a href={`${props.live}`} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md truncate'>{props.live}</a></div>
        </div>
        <div className='flex gap-1 flex-col'>
          <div><EditDeleteSubmit title={"Edit Project"} method={'PATCH'}  EditSubmit={props.submit} id={props.id} /></div>
          <div><EditDeleteSubmit title={"Delete Project"} method={'DELETE'} id={props.id} /></div>
        </div>
      </div>
    </div>

  </div>)
}
