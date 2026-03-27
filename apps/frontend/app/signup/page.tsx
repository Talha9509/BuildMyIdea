
import Form from '../components/Form'

const page = () => {
  return (
    <div className='min-h-screen '>
      <div className='bg-linear-to-r from-gray-800 via-blue-700 to-gray-900 min-h-screen '>
        Create Account
        <Form boolean={true} method={"signup"} />
      </div>
    </div>
  )
}

export default page
