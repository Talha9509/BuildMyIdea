import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <div className='flex justify-around min-h-[10vh] items-center'>
            <div className='text-3xl font-bold font-mono'><span className='text-[#FF3511]'>B</span>uildMyIdea</div>
            <div className='flex gap-2 items-center'>
            <Link href={"/signin"} className='px-5 py-2 rounded-4xl font-semibold hover:bg-gray-800'>Sign In</Link>
            <Link href={"/signup"} className='px-5 py-2 rounded-4xl font-semibold bg-[#FF3511]'>Get Started</Link>
            </div>
        </div>
    )
}

export default Navbar
