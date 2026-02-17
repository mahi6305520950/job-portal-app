import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/use-fetch'
import { getSingleJob } from '../api/apijobs'
import { BarLoader } from "react-spinners";
import job from './job'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select';
import { updateHiringStatus } from '../api/apijobs';
import ApplyJobDrawer from '@/components/apply-job'
import ApplicationCard from '@/components/ApplicationCard'







const JobPage = () => {

  const {isLoaded,user}=useUser()
  const {id}=useParams()

  const { fn: fnjob, data: Job, loading:loadingjob } =useFetch(getSingleJob, {job_id:id});
    const { fn: fnHiringStatus, loading:lodingHiringStatus } =useFetch(updateHiringStatus, {job_id:id});

  const handleStatusChange=(value)=>{
    const isOpen=value==="open"
    fnHiringStatus(isOpen).then(()=>fnjob())
  }
  console.log("jobdetails",Job)
  console.log("userdetails",user)

useEffect(()=>{
  if(isLoaded) fnjob()
},[isLoaded])

if(!isLoaded || loadingjob){
  return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
}
//console.log()
  return (
    <div className='flex flex-col gap-8 mt-5'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{Job?.title}</h1>
        <img src={Job?.company.logo_url} alt={Job?.title} className='h-13'/>
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <MapPinIcon/>
          {Job?.location}
        </div>
        <div className='flex gap-2'>
          <Briefcase/> {Job?.applications?.length} Applicants
        </div>
        <div className='flex gap-2'>
          {Job?.isOpen?<><DoorOpen/> Open</>:<><DoorClosed/> Closed</>}
        </div>

      </div>
      {/*hiring status  */}
        {lodingHiringStatus && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
      {
        Job?.recruiter_id===user?.id && (
             <Select  onValueChange={handleStatusChange} >
      <SelectTrigger className={`w-full ${Job?.isOpen?"bg-green-950":"bg-red-950"}`}>
        <SelectValue placeholder={
          "Hiring Status "+(Job?.isOpen?"(Open)":"(Closed)")
        } />
      </SelectTrigger>
      <SelectContent>
    
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>

      </SelectContent>
          </Select>
        )
      }

      <h1 className='text-2xl sm:text-3xl font-bold'>About the Job</h1>
      <p className='sm:text-lg'>{Job?.description}</p>
      <h1 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h1>
      <MDEditor.Markdown source={Job?.requirements} 
      className='markdown-content sm:text-lg'/>


      {/* render applications */}
      {Job?.recruiter_id!==user?.id && (
        <ApplyJobDrawer job={Job} user={user}
      fetchJob={fnjob} applied={Job?.applications?.find((ap)=>ap.candidate_id=user.id)}/>
      )}

      {
        Job?.applications?.length>0 && Job?.recruiter_id===user?.id && (
          <div className='flex flex-col gap-2 '>
            <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>
            {
              Job?.applications?.map((application)=>{
                return (
                  <ApplicationCard application={application} key={application.id}/>
                )
              })
            }
          </div>
        )
      }
      
    </div>

  )
}

export default JobPage