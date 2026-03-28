import React from 'react'
import Form from '../../components/Form'

const page = () => {
  return (
        <div className='min-h-screen bg-linear-to-r from-white via-gray-300 to-gray-900'>
      <div className='  min-h-screen  flex flex-col justify-center items-center bg-linear-to-br from-black via-gray-300 to-gray-700'>
        <div className=' border p-4 py-6 rounded-2xl flex flex-col justify-center items-center gap-4 bg-white min-h-[40vh] '>
        <div className='text-3xl p-2'>Sign In</div>
        <Form boolean={false} method={"signup"} />
        </div>
      </div>
    </div>
  )
}

export default page



