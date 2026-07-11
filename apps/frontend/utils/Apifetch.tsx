import { toast } from 'sonner'

export async function apiFetch(url: string, options: any) {
  try {
    const response = await fetch(url, options);
    const data=await response.json()
    if(!response.ok){
      toast.error(data.message,{duration:7000})
      // throw new Error("Error while fetching")
      return
    }
    console.log(data)
    return data;

  } catch (error) {
    console.log(error)
    throw error
  }
}

