import React from 'react'

export default async function profile ({params}:{params:{id:number}}) {
    const id=await params.id
  return (
    <div>
      Profile
      <div>{id}</div>
    </div>
  )
}
