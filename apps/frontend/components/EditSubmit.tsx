"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitSchema } from '@repo/common/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import edit from '../public/editProfile.svg'
import Cross from '../public/cross.svg'
import { toast } from 'sonner'
import { apiFetch } from '@/utils/Apifetch'
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const EditSubmit = (props: any) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(submitSchema), defaultValues: { liveLink: "", repoLink: "", NoofContributors: 1, items: [] } })
  const [onblur, setOnblur] = useState(false)
  // const [onLoading, setOnLoading] = useState(false)
  const [onSingle, setOnSingle] = useState(true)
  const url = process.env.NEXT_PUBLIC_BACKEND_URL

  const currentContributors = watch("NoofContributors") || 1;
  const currentItems = watch("items") || [];

  useEffect(() => {
    if (onblur) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [onblur])

  const teams = props.EditSubmit?.contributors?.length > 1
  console.log(props.EditSubmit.contributors)

  async function Edit() {
    setOnblur(true)

    const contributorList = (props.EditSubmit?.contributors || []).map((contributor: any) => ({
      username: contributor?.dev?.user?.username || '',
      contribution: contributor?.contributionPercent ?? 0,
      contributionRole: contributor?.contributionRole || 'Member'
    }))

    const formValues = {
      liveLink: props.EditSubmit?.liveLink || '',
      repoLink: props.EditSubmit?.repoLink || '',
      NoofContributors: props.EditSubmit?.NoofContributors || 1,
      items: teams ? contributorList : []
    }

    reset(formValues)
  }

  const handleTeamClick = () => {
    setOnSingle(false);
    setValue("NoofContributors", 2);
    setValue("items", [
      { username: "", contribution: 0, contributionRole: "Member" },
      { username: "", contribution: 0, contributionRole: "Member" }
    ]);
  }

  const handleSoloClick = () => {
    setOnSingle(true);
    setValue("NoofContributors", 1);
    setValue("items", []);
  }

  const handleContributorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count >= 2 && count <= 4) {
      setValue("NoofContributors", count);

      const newItems = Array.from({ length: count }).map((_, index) => {
        return currentItems[index] || { username: "", contribution: 0 };
      });
      setValue("items", newItems);
    }
  }

  async function editSubmission(formData: any) {
    const response = await apiFetch(`${url}/api/v1/submit/${props.id}`, {
      method: `PATCH`, credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    return response
  }

  const updateSubmitMutation = useMutation({
    mutationFn: editSubmission,
    onSuccess: () => {
      setOnblur(false)
      queryClient.invalidateQueries({ queryKey: ['profile-me'] })
      toast.success("Submission Edited", { duration: 5000 });
    }
  })

  async function onsubmit(data: any) {
    updateSubmitMutation.mutate(data)
  }
  return (<div>
    <button onClick={Edit} className='flex gap-1 border lg:px-2 px-1 cursor-pointer lg:rounded-lg rounded-sm   bg-gray-100 hover:bg-gray-300 text-black items-center lg:font-medium font-normal lg:text-base text-xs'><div className=' text-black'><Image src={edit} alt='Edit' className='lg:w-4 w-3 text-black'></Image></div>Edit</button>

    {onblur && (teams ?
      (<form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8  gap-2 bg-white rounded-2xl relative'>

            {/* {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>} */}

            <div className='relative'>
              <button type="button" className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl p-1 text-center'>Edit Submission</div>

            <div className='flex flex-col gap-1 pb-2'>

              <div><div>Live Link: <input className='border-black border-2 rounded-lg px-2 focus:outline-none w-80' {...register("liveLink")} /></div>
                {errors?.liveLink && <div className='text-sm px-2'>{errors.liveLink.message}</div>}
              </div>

              <div><div>Repo Link: <input className='border-black border-2 rounded-lg px-2 focus:outline-none w-80' {...register("repoLink")} /></div>
                {errors?.repoLink && <div className='text-sm px-2'>{errors.repoLink.message}</div>}
              </div>
            </div>

            <div className="flex gap-2 items-center p-1 rounded-lg">
              <label>Number of Contributors (2-4):</label>
              <input type="number" min="2" max="4" value={currentContributors} className="border-2 border-black rounded-md w-16 px-1 text-center" onChange={handleContributorCountChange} />
            </div>

            <div className="flex flex-col gap-2 border-l-4 border-blue-900 pl-2 mb-2">
              {Array.from({ length: currentContributors }).map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex flex-col">
                    <input placeholder="Username" className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none w-48' {...register(`items.${index}.username` as const)} />
                    {errors.items?.[index]?.username && <span className=" text-xs px-1">{errors.items[index]?.username?.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <input type="number" placeholder="%" className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none w-20' {...register(`items.${index}.contribution` as const, { valueAsNumber: true })} />
                      <span className="font-bold">%</span>
                    </div>
                    {errors.items?.[index]?.contribution && <span className=" text-xs px-1">{errors.items[index]?.contribution?.message}</span>}
                  </div>

                  <div className="flex flex-col">
                    <select className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none w-28 bg-white' {...register(`items.${index}.contributionRole` as const)}>
                      <option value="Leader">Leader</option>
                      <option value="Member">Member</option>
                    </select>
                    {errors.items?.[index]?.contributionRole && <span className="text-xs px-1">{errors.items[index]?.contributionRole?.message}</span>}
                  </div>
                </div>
              ))}

              {/* 100% Total Error */}
              {errors.items?.root?.message && (
                <div className="text-sm">{errors.items.root.message}</div>
              )}
            </div>

            <div className='text-center'>Note: Leader can Edit or Delete the Submission</div>

            <input type="submit" value="Submit Project" className='border-black border-2 rounded-4xl px-2  min-w-[3vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out' />
          </div>
        </div>
      </form>)
      :
      (<form onSubmit={handleSubmit(onsubmit)}>
        <div className='w-screen h-screen bg-slate-700/70 fixed top-0 left-0  flex justify-center items-center backdrop-blur-sm  z-20 text-black'>
          <div className='flex flex-col p-8  gap-2 bg-white rounded-2xl relative'>

            {/* {onLoading && <div className='rounded-2xl absolute inset-0 flex items-center justify-center text-3xl backdrop-blur-xs z-40 bg-gray-100/10 text-black'>Loading...</div>} */}

            <div className='relative'>
              <button type="button" className='cursor-pointer absolute top-0 right-0 p-1 hover:bg-gray-300 rounded-md min-w-2' onClick={() => setOnblur(false)}><Image src={Cross} alt='Plus'></Image></button>
            </div>
            <div className='text-3xl p-1 text-center'>Edit Submission</div>

            <div className='flex flex-col gap-1 pb-2'>

              <div>
                <div className='flex gap-1 items-center'>
                  <div>Contributors:</div>
                  <button className={`border-2 px-2 rounded-2xl ${onSingle ? `border-blue-950 text-blue-950 bg-blue-100` : ``}`} type='button' onClick={handleSoloClick}>Solo</button>
                  <button type='button' className={`border-2 px-2 rounded-2xl ${onSingle == false ? `border-blue-950 text-blue-950 bg-blue-100` : ``} `} onClick={handleTeamClick}>Team</button>
                </div>
              </div>

              <div><div>Live Link: <input className='border-black border-2 rounded-lg px-2 focus:outline-none w-80' {...register("liveLink")} /></div>
                {errors?.liveLink && <div className='text-sm px-2'>{errors.liveLink.message}</div>}
              </div>

              <div><div>Repo Link: <input className='border-black border-2 rounded-lg px-2 focus:outline-none w-80' {...register("repoLink")} /></div>
                {errors?.repoLink && <div className='text-sm px-2'>{errors.repoLink.message}</div>}
              </div>
            </div>

            {!onSingle && (<>
              <div className="flex gap-2 items-center p-1 rounded-lg">
                <label>Number of Contributors (2-4):</label>
                <input type="number" min="2" max="4" value={currentContributors} className="border-2 border-black rounded-md w-16 px-1 text-center" onChange={handleContributorCountChange} />
              </div>

              <div className="flex flex-col gap-2 border-l-4 border-blue-900 pl-2 mb-2">
                {Array.from({ length: currentContributors }).map((_, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex flex-col">
                      <input placeholder="Username" className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none w-48' {...register(`items.${index}.username` as const)} />
                      {errors.items?.[index]?.username && <span className=" text-xs px-1">{errors.items[index]?.username?.message}</span>}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <input type="number" placeholder="%" className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none w-20' {...register(`items.${index}.contribution` as const, { valueAsNumber: true })} />
                        <span className="font-bold">%</span>
                      </div>
                      {errors.items?.[index]?.contribution && <span className=" text-xs px-1">{errors.items[index]?.contribution?.message}</span>}
                    </div>

                    <div className="flex flex-col">
                      <select className='border-black border-2 rounded-lg px-2 py-1 focus:outline-none w-28 bg-white' {...register(`items.${index}.contributionRole` as const)}>
                        <option value="Leader">Leader</option>
                        <option value="Member">Member</option>
                      </select>
                      {errors.items?.[index]?.contributionRole && <span className="text-xs px-1">{errors.items[index]?.contributionRole?.message}</span>}
                    </div>
                  </div>
                ))}

                {/* 100% Total Error */}
                {errors.items?.root?.message && (
                  <div className="text-sm">{errors.items.root.message}</div>
                )}
              </div>
            </>
            )}
            <div className='text-center'>Note: Leader can Edit or Delete the Submission</div>

            <input type="submit" value="Submit Project" className='border-black border-2 rounded-4xl px-2  min-w-[3vw] cursor-pointer bg-blue-900 hover:bg-blue-950 text-white text-lg transition duration-300 ease-in-out' />
          </div>
        </div>
      </form>)
    )}



  </div>)
}