import React from 'react'
import { useUser } from '@clerk/clerk-react'
import useFetch from '../hooks/use-fetch'
import { GetSavedJobs } from '../api/apijobs'
import { BarLoader } from 'react-spinners'
import { useEffect } from 'react'
import JobCard from '../components/JobCard'



const Savedjob = () => {

  const {isLoaded} =useUser()

  const {
    loading:loadingSavedJobs,
    data:SavedJobsdata,
    fn:fnSavedJobs}=useFetch(GetSavedJobs)

useEffect(() => {
      if(isLoaded) fnSavedJobs();
    }, [isLoaded]);


  if(!isLoaded || loadingSavedJobs){
  return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
}
   
  return (
    <div>
      <h1 className='gradient-title font-extrabold pb-8 text-5xl sm:text-7xl text-center'>Saved Jobs</h1>
      {loadingSavedJobs===false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {SavedJobsdata?.length?(
            SavedJobsdata.map((saved) => {
              return (
                <JobCard key={saved.id} job={saved.job}
                savedInit={true} onJobSaved={fnSavedJobs}/>
              )
            })
          ):(
            <p className='text-center text-gray-500'>No Saved-jobs found.👀</p>
          )
          }
          
        </div>
      )}
    </div>
  )
}

export default Savedjob