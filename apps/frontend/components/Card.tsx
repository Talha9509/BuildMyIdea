"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Card = (props: any) => {
    const router=useRouter()
    console.log(props.repo)
    return (
        <div className='flex flex-wrap gap-4 mx-auto'>
        <div className='text-white border p-4 w-[20vw] rounded-2xl'>
            <Link href={`/profile/${props.devId}`}><div>Name: {props.devName}</div></Link>
            <div>Repo Link: <a href={`${props.repo}`}  target="_blank" rel="noopener noreferrer">{props.repo}</a></div>
            <div>Live Link: <a href={`${props.repo}`}  target="_blank" rel="noopener noreferrer">{props.live}</a></div>
        </div>
        <div className='text-white border p-4 w-[20vw] rounded-2xl'>
            <Link href={`/profile/${props.devId}`}><div>Name: {props.devName}</div></Link>
            <div>Repo Link: <a href={`https:github.com`}  target="_blank" rel="noopener noreferrer">{props.repo}</a></div>
            <div>Live Link: <a href={`${props.repo}`}  target="_blank" rel="noopener noreferrer">{props.live}</a></div>
        </div>
       
        </div>
    )
}

export default Card
