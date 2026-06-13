"use client"
import React from 'react'
import {useRouter} from 'next/navigation'

const Logout = () => {
  const router=useRouter()
  async function logout() {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL
      const res = await fetch(`${url}/auth/v1/logout`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      console.log(res)
      if(res.status===200){
        router.push("/")
      }

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <button onClick={logout} className='text-white border lg:px-4 lg:py-1 px-1 lg:rounded-4xl rounded-lg lg:text-base text-xs' >Logout</button>
    </div>
  )
}

export default Logout
