"use client"
import Link from 'next/link'
// import { EditSubmit } from './EditSubmit'
import { EditSubmit } from './edit'
import { DeleteSubmit } from './DeleteSubmit'
import Image from 'next/image'
import star from '../public/star.svg'
import { AddRemoveStar } from '@/components/AddRemoveStar'

export const Card = (props: any) => {
  console.log("star given " + props.starGiven)
  return (<Link href={`/submit/${props.id}`}>
    <div className='flex border lg:p-4 p-3 lg:min-w-[20vw] lg:max-w-[45vw] gap-4 justify-between rounded-2xl'>
      <div className='text-white  flex flex-col gap-1'>

        {(props.Profile || props.personalProfile) ? (
          <div className='lg:text-base text-sm'>Name of Project:&nbsp;{props.project.name}</div>
        ) : (
          <div className='flex flex-col gap-1'>
            <div className='lg:text-base text-sm'><span className='lg:text-lg lg:font-semibold'>{props.contributors.length > 1 ? `Contributors :` : `Contributor :`}</span>
              <div className=' flex flex-col gap-1'>
                {(Array.isArray(props.contributors) ? props.contributors : []).map((contributor: any, index: number) => {
                  const user = contributor?.dev?.user
                  if (!user) return null
                  return (
                    <div key={Math.round(Math.random() * 10000)} className='lg:text-base text-sm  grid grid-cols-3 gap-4'>
                      <div>Name: {user.name}</div>
                      <div>Contribution: {contributor.contributionPercent}%</div>
                      <div>Role: {contributor.contributionRole}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {(props.Profile || props.personalProfile) && <div className='lg:text-base text-sm flex gap-8'>
          <div>Contribution: {props.percent}%</div>
          <div>Role: {props.role}</div>
        </div>}
        <div className='lg:text-base text-sm'>Repo Link:<span className='px-2 rounded-md truncate underline'>{props.repo}</span></div>
        <div className='lg:text-base text-sm'>Live Link:<span className='px-2 rounded-md truncate underline'>{props.live}</span></div>
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

        {/* {(props.personalProfile) && <div className='flex flex-col gap-1'>
          <div><EditSubmit EditSubmit={props.submit} id={props.id} /></div>
          <div><DeleteSubmit id={props.id} /></div>
        </div>} */}

      </div>
    </div>

  </Link>)
}
