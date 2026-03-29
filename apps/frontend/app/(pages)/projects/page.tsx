import React from 'react'
import Logout from '../../components/Logout'

const page = () => {
  return (
    <div className='bg-black min-h-screen p-4'>
        <div className='text-white'>
            <div className='text-3xl'>Projects</div>
            <Logout/>
        </div>
    </div>
  )
}

export default page
