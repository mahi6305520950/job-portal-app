import React, { use } from 'react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AddNewCompany } from '../api/apiCompanies'
import { Input } from "./ui/input"
import useFetch from '@/hooks/use-fetch'
import { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const schema=z.object({
    name:z.string().min(1,{message:"Company name is required"}),
    logo:z.any().
    refine((file)=>file[0] && (file[0].type==="image/png" || file[0].type==="image/jpeg"),{message:"Only Images are allowed"})
})


const AddCompanyDrawer = ({fetchCompanies}) => {




    const {
        loading:loadingAddCompany,
        error:errorAddCompany,
        data:dataAddCompany,
        fn:fnAddCompany}=useFetch(AddNewCompany)

  const {register,
    handleSubmit,
    control,
    formState:{errors},
    reset}=useForm({resolver:zodResolver(schema)})

    const onSubmit=(data)=>{
        fnAddCompany({
            ...data,
            logo:data.logo[0]
        })
    }
    useEffect(()=>{
        if(dataAddCompany?.length>0) fetchCompanies()
    },[loadingAddCompany])

  return (
    <Drawer>
  <DrawerTrigger>
    <Button type="button" variant='secondary' size='sm'  >
        Add Company
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Add a New Company</DrawerTitle>
    </DrawerHeader>
    <form className='flex gap-2 p-4 pb-0'>
        <Input placeholder="Company Name" {...register("name")}/>
        <Input
        type="file"
        accept="image/*"
        {...register("logo")}
        className="file:text-gray-500"
        />
        <Button type="button" onClick={handleSubmit(onSubmit)} variant='destructive' className="w-40">
            Add
        </Button>
    </form>
    {errors.name && <p className='text-sm text-red-600 px-4'>{errors.name.message}</p>}
    {errors.logo && <p className='text-sm text-red-600 px-4'>{errors.logo.message}</p>}
    {errorAddCompany?.message && <p className='text-sm text-red-600 px-4'>{errorAddCompany?.message}</p>}
    {loadingAddCompany && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}

    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="secondary" type="button">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default AddCompanyDrawer