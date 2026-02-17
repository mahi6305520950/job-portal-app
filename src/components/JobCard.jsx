import React, { use } from 'react'
import { Card, CardContent, CardFooter } from './ui/card';
import { MapPin, MapPinIcon, Trash2Icon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { CardHeader, CardTitle } from './ui/card';
import job from '@/pages/job';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import useFetch from '../hooks/use-fetch';
import { useEffect } from 'react';
import { saveJob } from "../api/apijobs";
import { DeleteJob } from '../api/apijobs';
import { BarLoader } from 'react-spinners';



const JobCard = ({
    job,
    isMyjob = false,
    savedInit=false,
    onJobSaved=()=>{},
}) => {
    const [saved, setSaved] =React.useState(savedInit);
    const {user}=useUser();
    const { fn: fnSavedJob, data: savedJob, loading:loadingSavedJob } =useFetch(saveJob, {
    alreadySaved:saved,
    });

    const {
        fn: fnDeleteJob,
        loading:loadingDeleteJob}=useFetch(DeleteJob,{
            job_id:job.id
    })

    const handleDeleteJob=async()=>{
        await fnDeleteJob()
        onJobSaved()
    }

    
    const handleSaveJob=async()=>{
        await fnSavedJob({
            user_id:user.id,
            job_id:job.id,
        });
        onJobSaved();
        }

        useEffect(() => {
  if (savedJob !== undefined) {
    setSaved(prev => !prev); 
  }
}, [savedJob]);



  return (
    <Card>
        {loadingDeleteJob && (
      <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
       )}
        <CardHeader>
            <CardTitle className='flex justify-between font-bold '>
                {job.title}
            {isMyjob && (<Trash2Icon fill="red" 
            size={18} 
            className='text-red-300 cursor-pointer'
            onClick={handleDeleteJob}
            />)}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
            <div className='flex justify-between'>
                {job.company && (<img src={job.company.logo_url} alt={job.company.name} className='h-9 w-auto object-contain'/>)}
                <div className='flex gap-2 items-center'>
                    <MapPinIcon size={15}/> {job.location}
                </div>
            </div>
            <hr/>
            {job.description.substring(0,job.description.split(".")[0].length+1)}
        </CardContent>
        <CardFooter className="flex gap-2">
            <Link to={`/jobs/${job.id}`} className="flex-1">
                <Button variant='secondary' className="w-full">More details</Button>
            </Link>
            {!isMyjob &&(
                <Button variant='outline' className="w-15"
                
                onClick={handleSaveJob}
                disabled={loadingSavedJob}
                >
                    {saved? (
                        <Heart size={20} stroke="red" fill='red'/>
                    ):(
                        <Heart size={20} />
                    )}
                </Button>
            )}
            
        </CardFooter>

    </Card>
  )
}

export default JobCard