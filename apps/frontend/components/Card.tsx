"use client"
import Link from 'next/link'
import { EditSubmit } from './EditSubmit'
import { DeleteSubmit } from './DeleteSubmit'
import Image from 'next/image'
import star from '../public/star.svg'
import { AddRemoveStar } from '@/components/AddRemoveStar'

export const Card = (props: any) => {
  console.log("star given " + props.starGiven)
  return (<div>
    <div className='flex border lg:p-4 p-3 lg:min-w-[20vw] lg:max-w-[45vw] gap-4 justify-between rounded-2xl'>
      <div className='text-white  flex flex-col gap-1'>

        {(props.Profile || props.personalProfile) ? <div className='lg:text-base text-sm'>Name of Project:&nbsp;<Link className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md' href={`/project/${props.project.id}`}>{props.project.name}</Link></div> :
          <div className='lg:text-base text-sm'>Name:&nbsp;<Link className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md' href={`/profile/${props.devId}`}>{props.devName}</Link></div>
        }

        <div className='lg:text-base text-sm'>Repo Link: <a href={`${props.repo}`} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md truncate'>{props.repo}</a></div>
        <div className='lg:text-base text-sm'>Live Link: <a href={`${props.live}`} target="_blank" rel="noopener noreferrer" className='bg-gray-900 hover:bg-gray-600 px-2 rounded-md truncate'>{props.live}</a></div>
      </div>
      <div className='flex gap-2 flex-col'>

        {(props.Profile || props.personalProfile) ?
          <div className='flex gap-1'>
            <Image src={star} alt='Star' className='lg:w-4 w-3' />
            <div className='lg:text-sm text-xs'>{props.stars}</div>
          </div>
          :
          <AddRemoveStar starGiven={props.starGiven} stars={props.stars} id={props.id} projectId={props.projectId} />
        }

        {(props.personalProfile) && <div className='flex flex-col gap-1'>
          <div><EditSubmit EditSubmit={props.submit} id={props.id} /></div>
          <div><DeleteSubmit id={props.id} /></div>
        </div>}

      </div>
    </div>

  </div>)
}
