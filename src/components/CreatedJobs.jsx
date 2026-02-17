import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { GetMyJobs } from '../api/apijobs'
import { BarLoader } from 'react-spinners'
import { useEffect } from 'react'
import JobCard from './JobCard'

const CreatedJobs = () => {
    const {isLoaded,user}=useUser()

    const {
        fn: fnMyJobs,
         data: MyJobs,
         loading:loadingMyJobs}=useFetch(
        GetMyJobs,{
            recruiter_id:user.id
        })
    useEffect(() => {
        fnMyJobs();
    }, []);
    
    if(!isLoaded || loadingMyJobs){
       return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }



  return (
    <div>
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {MyJobs?.length?(
            MyJobs.map((job) => {
              return (
                <JobCard 
                key={job.id} 
                job={job} 
                isMyjob
                onJobSaved={fnMyJobs}
              />
              
            )})):(
            <p className='text-center text-gray-500'>No jobs found.🤐</p>
          )
          }
          
        </div>
    </div>
  )
}

export default CreatedJobs