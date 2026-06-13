'use client'
import { Suspense } from 'react'
import { SearchProfile } from '@/components/SearchProfile'
import { SearchBar } from '@/components/SearchBar'

export default function Search() {
  return (
    <Suspense fallback={<div className='h-screen flex justify-center py-50 text-white lg:text-5xl text-2xl'>Loading...</div>}>
      <div className='text-white'>
      <SearchBar />
      <SearchProfile />
      </div>
    </Suspense>
  )
}