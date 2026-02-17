
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select';
import { State } from 'country-state-city'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { BarLoader } from 'react-spinners'
import { getCompanies } from '../api/apiCompanies'
import useFetch from '../hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { Navigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { AddNewJob } from '../api/apiAplications'
import { useNavigate } from 'react-router-dom'
import { AddNewCompany } from '../api/apiCompanies'
import AddCompanyDrawer from '@/components/AddCompanyDrawer'




const schema=z.object({
  title:z.string().min(1,{message:"Title is required"}),
  description:z.string().min(1,{message:"Description is required"}),
  location:z.string().min(1,{message:"Select a Location "}),
  company_id:z.string().min(1,{message:"Select or Add a New Company"}),
  requirements:z.string().min(1,{message:"Requirements are required"}),
})

const Postjob = () => {

  const {user,isLoaded}=useUser()
  const navigate=useNavigate()

  const { fn: fnCompanies, data: companies,loading:loadingCompanies} =useFetch(getCompanies);

  useEffect(() => {
    if(isLoaded) fnCompanies();
  }, [isLoaded]);


    const {register,handleSubmit,control,formState:{errors},reset}=useForm({
              defaultValues:{
                location:"",
                company_id:"",
                requirements:"- ",
              },
          resolver:zodResolver(schema)
        })


    const {
      loading:loadingCreatejob,
      error:errorCreatejob,
      data:dataCreatejob,
      fn:fnCreateJob}=useFetch(AddNewJob)

    const onSubmit=(data)=>{
      fnCreateJob({
        ...data,
        recruiter_id:user.id,
        isOpen:true
      })
    }
useEffect(()=>{
  if(dataCreatejob?.length>0) navigate("/jobs")
},[dataCreatejob])

      
    if(!isLoaded || loadingCompanies){
      return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    if(user?.unsafeMetadata?.role!=="recruiter"){
      return <Navigate to="/jobs" />;
    }
    
    console.log("compainies :",companies)

  return (
    <div>
      <h1 className='gradient-title font-extrabold pb-8 text-5xl sm:text-7xl text-center'>Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
        <Input
      placeholder="Job Title"
      {...register("title")}
      />
      {
        errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>
      }
      <Textarea
      placeholder="Job Description"
      {...register("description")}
      />
      {
        errors.description && <p className='text-sm text-red-600'>{errors.description.message}</p>
      }
      <div className='flex gap-4 items-center'>
        <Controller
      control={control}
      name="location"
      render={({field})=>(
        <Select 
      value={field.value} 
      onValueChange={field.onChange}
      >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {State.getStatesOfCountry("IN").map((state)=>(
            <SelectItem key={state.isoCode} value={state.name}>{state.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
          </Select>
      )}
        />
      
         <Controller
      control={control}
      name="company_id"
      render={({field})=>(
        <Select 
          value={field.value} 
          onValueChange={field.onChange}
          >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Company" >
                    {field.value?companies?.find((com)=>com.id===Number(field.value))?.name:"Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id.toString()}>{company.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
            </Select>

      )}
      /> 

      <AddCompanyDrawer fetchCompanies={fnCompanies}/>

      </div> 

      {
        errors.location && <p className='text-sm text-red-600'>{errors.location.message}</p>
      }
      {
        errors.company_id && <p className='text-sm text-red-600'>{errors.company_id.message}</p>
      }
      
          
            {/*add drawer */}
      <Controller
      control={control}
      name="requirements"
      render={({field})=>(
      <div
      data-color-mode="dark"
      className="bg-transparent"
    >
      <MDEditor
        value={field.value}
        onChange={field.onChange}
        className="bg-transparent"
      />
    </div>




      )}/>
      {
        errors.requirements && 
        <p className='text-sm text-red-600'>{errors.requirements.message}</p>
      }
      {loadingCreatejob && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
      {
        errorCreatejob?.message && 
        <p className='text-sm text-red-600'>{errorCreatejob?.message}</p>
      }
            <Button type="submit" className="mt-2" variant='blue' size="lg">
              Submit
            </Button>
          
      </form>
    </div>
  )
}

export default Postjob