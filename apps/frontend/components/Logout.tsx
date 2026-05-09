"use client"
import React from 'react'
import {useRouter} from 'next/navigation'

const Logout = () => {
  const router=useRouter()
  async function logout() {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      // post
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
      <button onClick={logout} className='text-white px-4 py-1 rounded-4xl border' >Logout</button>
    </div>
  )
}

export default Logout
