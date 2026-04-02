"use client"
import React from 'react'

const Logout = () => {
    async function logout() {
        try {
            const url=process.env.BACKEND_URL || "http://localhost:3001"
            // post
            const res=await fetch(`${url}/api/v1/logout`,{ method:'POST', credentials:'include', headers: { 'Content-Type': 'application/json' }})
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
      <button onClick={logout} className='text-white' >Logout</button>
    </div>
  )
}

export default Logout
