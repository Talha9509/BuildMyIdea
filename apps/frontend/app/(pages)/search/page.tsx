'use client'
import { Suspense } from 'react'
import { SearchSuspense } from '@/components/SearchSuspense'

export default function Search() {
  return (
    <Suspense fallback={<div className='h-screen flex justify-center py-50 text-white text-5xl'>Loading...</div>}>
      <SearchSuspense />
    </Suspense>
  )
}