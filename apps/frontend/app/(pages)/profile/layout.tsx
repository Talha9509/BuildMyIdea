import React from 'react'
import Navbar from '../../../components/Navbar2'

export default function ProfileLayout ({children}:{children:React.ReactNode}) {
  return (
    <div>
      <div className='bg-gray-950 min-h-screen p-2 '>
      <Navbar />
      <div className='text-white'>
        <div>{children}</div>
        </div>
        </div>
    </div>
  )
}


