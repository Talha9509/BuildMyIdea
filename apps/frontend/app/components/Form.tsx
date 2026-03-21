"use client"
import {useForm} from 'react-hook-form'
import React from 'react'
import {UserSchema} from '@repo/common/types'
import {zodResolver} from '@hookform/resolvers/zod'
import axios from 'axios'
import {useRouter} from 'next/navigation'

const Form = (props:any) => {
    const router=useRouter()
    const url=process.env.BACKEND_URL || "http://localhost:3001"
    const {register,handleSubmit,formState:{errors}}=useForm({resolver:zodResolver(UserSchema)})
    // console.log(errors)
    async function  onSubmit(data:any){
        console.log(`${url}/api/v1/${props.method}`)
        const response= await axios.post(`${url}/api/v1/${props.method}`,data)
        console.log(response)
        console.log(response.data,response.data.message,response.data.token)
        // const data1=JSON.parse(response)
        try {
            if(response.status===200){
                localStorage.setItem("token",response.data.token)  
                router.push("/") 
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {props.boolean && <div><input {...register("name")} placeholder='name' /></div>}
            <div><input  {...register("email")} placeholder='@gmail.com' /></div>
            {errors.email && <div>{errors.email?.message}</div>}
            <div><input  {...register("password")} type='password' placeholder='*****' /></div>
            {errors.email && <div>{errors.password?.message}</div>}
            <div><input type='submit' /></div>
        </form>
      
    </div>
  )
}

export default Form
