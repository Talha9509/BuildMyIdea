"use client"
import { useQuery } from "@tanstack/react-query"
// import { EditSubmit } from '@/components/edit'
import { EditSubmit } from '@/components/EditSubmit'
import { DeleteSubmit } from '@/components/DeleteSubmit'
import Link from 'next/link'

export const SubmitId = (props: any) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/submit/${props.id}`

  async function fetchSubmitId() {
    const response = await fetch(url, {
      credentials: 'include'
    })

    if (response.status === 401) {
      const error: any = new Error('Unauthorized')
      error.status = 401
      throw error
    }

    const data = await response.json()
    const submit = data.submit
    const isMember = submit.contributors.some((t: any) => t.dev.id === data.userId)

    return { submit, isMember }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["submit-id", props.id],
    queryFn: fetchSubmitId,
    retry: false,
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000
  })

  const submit = data?.submit
  const member = data?.isMember ?? false

  if (isLoading || !submit) {
    return <div className='text-white text-3xl h-[70vh] flex justify-center items-center p-4'>Loading...</div>
  }

  return (
    <div>
      <div className='text-white p-4 max-w-5xl mx-auto'>

        <div className='flex flex-col justify-center items-center pb-6'>
          <div className='text-gray-400 lg:text-lg text-sm mb-1'>Submission for Project</div>
          <Link href={`/project/${submit.project.id}`} className='lg:text-4xl text-2xl font-semibold text-center'>{submit.project.name}</Link>
        </div>

        {member && <div className="flex justify-end gap-3 mb-4 mx-2">
          <div><EditSubmit EditSubmit={submit} id={submit.id} /></div>
          <div><DeleteSubmit id={submit.id} /></div>
        </div>}

        <div className="border border-gray-700 mx-2 lg:px-6 px-4 rounded-2xl bg-gray-900 shadow-lg">
          <div className='flex flex-col gap-6 lg:py-8 py-5'>

            <div className='flex flex-col lg:flex-row gap-6 lg:gap-16'>
              <div className="flex flex-col gap-6 flex-1">
                <div className='lg:text-xl text-sm font-medium text-gray-300'>Live Link
                  <div className='lg:text-base text-xs text-blue-400 hover:text-blue-300 truncate mt-1'>
                    <Link href={submit.liveLink} target="_blank">{submit.liveLink}</Link>
                  </div>
                </div>
                <div className='lg:text-xl text-sm font-medium text-gray-300'>Repository Link
                  <div className='lg:text-base text-xs text-blue-400 hover:text-blue-300 truncate mt-1'>
                    <Link href={submit.repoLink} target="_blank">{submit.repoLink}</Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 flex-1 border-t lg:border-t-0 lg:border-l border-gray-700 pt-6 lg:pt-0 lg:pl-16">
                <div className='lg:text-xl text-sm font-medium text-gray-300'>Team Size
                  <div className='lg:text-2xl text-lg font-bold text-white mt-1'>{submit.NoofContributors} {submit.NoofContributors === 1 ? 'Developer' : 'Developers'}</div>
                </div>
                <div className='lg:text-xl text-sm font-medium text-gray-300'>Total Stars
                  <div className='lg:text-2xl text-lg font-bold text-yellow-500 mt-1 flex items-center gap-2'>★ {submit._count.stars}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:py-10 lg:px-4 py-8 mt-4'>
          <div className='lg:text-2xl text-xl font-semibold mb-6 mx-2 '>Contributors</div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mx-2'>
            {submit.contributors.length >= 1 && submit.contributors.map((contribution: any) => {
              return (
                <Link key={contribution.dev.id} href={`/profile/${contribution.dev.id}`} className="border border-gray-700 bg-gray-800/50 rounded-xl p-5 hover:bg-gray-800 transition duration-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Developer</div>
                      <div className="text-lg lg:text-xl font-bold hover:text-blue-400 transition">{contribution.dev.user.username}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${contribution.contributionRole === 'Leader'
                        ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                        : 'bg-gray-700 text-gray-300 border border-gray-600'
                      }`}>
                      {contribution.contributionRole}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Contribution</span>
                      <span className="font-bold text-white">{contribution.contributionPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${contribution.contributionPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}





// {
//     "submit": {
//         "liveLink": "https://github.com/Talha9509",
//         "repoLink": "https://github.com/Talha9509",
//         "NoofContributors": 1,
//         "project": {
//             "name": "Decentralized Exchange",
//             "id": 73
//         },
//         "_count": {
//             "stars": 1
//         },
//         "contributors": [
//             {
//                 "contributionPercent": 100,
//                 "contributionRole": "Leader",
//                 "dev": {
//                     "id": 18,
//                     "user": {
//                         "name": "Mohd Talha"
//                     }
//                 }
//             }
//         ]
//     }
// }