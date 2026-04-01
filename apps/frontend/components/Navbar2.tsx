import React from 'react'
import Link from 'next/link'
import Logout from '../components/Logout'

const Navbar2 = () => {
  return (
    <div>
      <div className='flex justify-around min-h-[10vh] items-center py-2'>
            <Link href={"/"}>
            <div className='text-3xl font-bold font-mono'><span className='text-[#c2c1c1]'>BuildMy</span><span className='text-[#FF3511]'>Idea</span></div>
            </Link>
            <div className='flex gap-2 items-center'>
            <Link href={"/signin"} className='px-4 py-1 rounded-4xl font-semibold bg-gray-100 hover:bg-gray-300'>Notifications</Link>
            <Link href={"/profile"} className='px-4 py-1 rounded-4xl font-semibold bg-[#FF3511]'>Profile</Link>
            <Logout ></Logout>
            </div>
        </div>
    </div>
  )
}

export default Navbar2
