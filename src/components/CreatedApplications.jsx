import useFetch from '@/hooks/use-fetch'
import React, { useEffect } from 'react'
import { GetApplications } from '../api/apiAplications'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import ApplicationCard from './ApplicationCard'


const CreatedApplications = () => {
    const {user,isLoaded}=useUser()
    const {
         fn: fnapplications,
         data: applications,
         loading:loadingapplications}=useFetch(GetApplications,{
            user_id:user.id
         })

        useEffect(() => {
            fnapplications();
        }, []);


         if(loadingapplications){
            return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
         }
         console.log("applications :",applications)
  return (
    <div className='flex flex-col gap-2'>
        {applications?.map((application)=>{
            return (
                <ApplicationCard application={application} key={application.id} isCandidate/>
            )
            })
        }
    </div>
  )
}

export default CreatedApplications