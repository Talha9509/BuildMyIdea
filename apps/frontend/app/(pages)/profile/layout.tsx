import React from 'react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='text-white'>
        <div>{children}</div>
      </div>
    </div>
  )
}


