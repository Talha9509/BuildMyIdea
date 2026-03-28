
import Form from '../../components/Form'

const page = () => {
  return (
    <div className='min-h-screen bg-linear-to-r from-white via-gray-300 to-gray-900'>
      <div className='  min-h-screen  flex flex-col justify-center items-center bg-linear-to-br from-black via-gray-300 to-gray-700'>
        <div className=' border p-4 rounded-2xl flex flex-col justify-center items-center gap-4 bg-white  '>
        <div className='text-3xl p-2'>Create Account</div>
        <Form boolean={true} method={"signup"} />
        </div>
      </div>
    </div>
  )
}

export default page
