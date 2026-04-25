import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <div className='flex justify-around min-h-[10vh] items-center py-2'>
            <Link href={"/"}>
            <div className='text-4xl font-bold font-mono'><span className='text-[#c2c1c1]'>BuildMy</span><span className='text-[#ff4e2f]'>Idea</span></div>
            </Link>
            <div className='flex gap-2 items-center'>
            <Link href={"/signin"} className='px-5 py-2 rounded-4xl font-semibold bg-gray-100 hover:bg-gray-300'>Sign In</Link>
            <Link href={"/signup"} className='px-5 py-2 rounded-4xl font-semibold bg-[#FF3511]'>Create Account</Link>
            </div>
        </div>
    )
}

export default Navbar
