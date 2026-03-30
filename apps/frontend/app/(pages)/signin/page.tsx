import React from 'react'
import Form from '../../../components/Form'
import Link from 'next/link'
import Image from 'next/image'
import Google from '../../../public/google-50.svg'
import GitHub from '../../../public/github.svg'
import Twitter from '../../../public/twitter.svg'

const page = () => {
  return (
    <>
      <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden">

        <div className="absolute bottom-0 left-[-20%] top-[-10%] h-125 w-125 rounded-full 
        bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),transparent)]" />

        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-125 w-125 rounded-full 
        bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,0.15),transparent)]" />

        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center">
          <div className="border p-6 rounded-2xl flex flex-col justify-center items-center bg-white shadow-xl">
            <div className="text-4xl p-2 pb-4">Sign In</div>
            <Form boolean={false} method={"signin"} />
            {/* <div className='text-gray-600'>or</div> */}
            <div className='text-lg p-2'>Sign In with</div>
            <div className='flex gap-2'>
            <Link href={`${process.env.BACKEND_URL}/auth/google`} ><button className='border p-2 px-4 cursor-pointer rounded-2xl min-w-[2rem]'><Image src={Google} alt='Google'></Image></button></Link>
            <Link href={`${process.env.BACKEND_URL}/auth/github`} ><button className='border p-2 px-4 cursor-pointer rounded-2xl min-w-[2rem]'><Image src={GitHub} alt='GitHub'></Image></button></Link>
            <Link href={`${process.env.BACKEND_URL}/auth/twitter`} ><button className='border p-2 px-4 cursor-pointer rounded-2xl min-w-[2rem]'><Image src={Twitter} alt='X'></Image></button></Link>
          </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default page





















// components.json
// {
// "$schema": "https://ui.shadcn.com/schema.json",
//   "style": "radix-nova",
//   "rsc": false,
//   "tsx": true,
//   "tailwind": {
//     "config": "",
//     "css": "src/styles/globals.css",
//     "baseColor": "neutral",
//     "cssVariables": true,
//     "prefix": ""
//   },
//   "aliases": {
//     "components": "@/components",
//     "utils": "@/lib/utils",
//     "ui": "@/components/ui",
//     "lib": "@/lib",
//     "hooks": "@/hooks"
//   },
//   "iconLibrary": "lucide"

// }












// {
//   "$schema": "https://ui.shadcn.com/schema.json",
//   "style": "base-nova",
//   "rsc": true,
//   "tsx": true,
//   "tailwind": {
//     "config": "",
//     "css": "app/globals.css",
//     "baseColor": "neutral",
//     "cssVariables": true,
//     "prefix": ""
//   },
//   "iconLibrary": "lucide",
//   "rtl": false,
//   "aliases": {
//     "components": "@/components",
//     "utils": "@/lib/utils",
//     "ui": "@/components/ui",
//     "lib": "@/lib",
//     "hooks": "@/hooks"
//   },
//   "menuColor": "default",
//   "menuAccent": "subtle",
//   "registries": {}

// }