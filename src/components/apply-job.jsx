import React from 'react'
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
import {Input} from './ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApplyToJob } from '@/api/apiAplications'
import { Controller } from 'react-hook-form'
import { BarLoader } from 'react-spinners'
import useFetch from '../hooks/use-fetch'
import { useState } from 'react'
import { useEffect } from 'react'







const schema=z.object({
  experience:z.number().min(0,{message:"Experience cannot be negative"}).int(),
  skills:z.string().min(1,{message:"Skills are required"}),
  education:z.enum(["Intermediate","Graduate","Post Graduate"],{"message":"education is required"}),
  resume:z.any().refine((file)=>file[0] && (file[0].type==="application/pdf" || file[0].type==="application/msword"),{message:"Only PDF or Word documents are allowed"})

})



const ApplyJobDrawer = ({job,user,fetchJob,applied=false}) => {

  //console.log("job title:", job?.title)
  //console.log("job:", job)
  const [open, setOpen] = useState(false)
  const [isApplied, setIsApplied] = useState(applied)

  useEffect(() => {
  setIsApplied(applied)
}, [applied])


    const {register,handleSubmit,control,formState:{errors},reset}=useForm({
      resolver:zodResolver(schema)
    })

    const {loading:loadingapply,error:errorApply,fn:fnApply}=useFetch(ApplyToJob)

    const onSubmit = async (data) => {
  await fnApply({
    ...data,
    job_id: job.id,
    candidate_id: user.id,
    name: user.fullName,
    status: "applied",
    resume: data.resume[0],
  })

  setIsApplied(true)   
  setOpen(false)       
  reset()
  fetchJob()        
}


  return (
  <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button size='lg' variant={job?.isOpen && !isApplied ? "blue" : "destructive"}
disabled={!job?.isOpen || isApplied}
 >
      {job?.isOpen?(isApplied ? "Applied":"Apply"):"Hiring Closed"}
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Apply for {job?.title} at {job?.company?.name} </DrawerTitle>
      <DrawerDescription>Please Fill the form below.</DrawerDescription>
    </DrawerHeader>

    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
      <Input
      type="number"
      placeholder="Years of Experience"
      className="flex-1"
      {...register("experience",{
        valueAsNumber:true
      })}
      />
      {
        errors.experience && <p className='text-sm text-red-600'>{errors.experience.message}</p>
      }
      <Input
      type="text"
      placeholder="Skills (superated by comma)"
      className="flex-1"
      {...register("skills")}
      />
      {
        errors.skills && <p className='text-sm text-red-600'>{errors.skills.message}</p>
      }
      <Controller
      control={control}
      name="education"
      render={({field})=>(
        <RadioGroup onValueChange={field.onChange} {...field} className="w-fit">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="Intermediate" id="intermediate" />
        <Label htmlFor="intermediate">Intermediate</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="Graduate" id="graduate" />
        <Label htmlFor="graduate">Graduate</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="Post Graduate" id="post-graduate" />
        <Label htmlFor="post-graduate">Post Graduate</Label>
      </div>
    </RadioGroup>
      )}
      />
      {
        errors.education && <p className='text-sm text-red-600'>{errors.education.message}</p>
      }


      
    <Input
      type="file" accept=".pdf,.doc,.docx"
      className="flex-1 file:text-gray-500"
      {...register("resume")}
    />
    {
      errors.resume && <p className='text-sm text-red-600'>{errors.resume.message}</p>
    }
    {
      errorApply?.message && <p className='text-sm text-red-600'>{errorApply?.message}</p>
    }
    {
      loadingapply && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }
      <Button type="submit" variant='blue' size='lg'>Apply</Button>
    </form>


    <DrawerFooter>
      
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default ApplyJobDrawer