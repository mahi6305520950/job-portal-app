import React, { useEffect } from 'react'
import { useSession, useUser } from "@clerk/clerk-react";
import useFetch from '../hooks/use-fetch'
import { getJobs } from '../api/apijobs';
import { useState } from 'react';
import { BarLoader } from "react-spinners";
import JobCard from '../components/JobCard';
import { GetCompanies } from '../api/apiCompanies';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select';
import { State } from 'country-state-city';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"



const Joblisting = () => {

  const {isLoaded, user }=useUser();  
  const [location, setLocation] = useState('');
  const [company_id, setCompany_Id] =useState(""); 
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;



const {
  fn: fnjobs,
  data: jobResponse,
  loading: loadingjobs
} = useFetch(getJobs, {
  location,
  company_id,
  searchQuery,
  page,
  limit
});

const Jobs = jobResponse?.data || [];
const total = jobResponse?.count || 0;
const totalPages = Math.ceil(total / limit);



const { fn: fnCompanies, data: companies} =useFetch(GetCompanies);
 
  
useEffect(() => {
  if (isLoaded) {
    fnjobs();
  }
}, [isLoaded, location, company_id, searchQuery, page]);

useEffect(() => {
  setPage(1);
}, [location, company_id, searchQuery]);





  useEffect(() => {
    if(isLoaded) fnCompanies();
  }, [isLoaded]);



  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if(query) setSearchQuery(query);
  };
  const clearfilters=()=>{
    setLocation("")
    setCompany_Id("")
    setSearchQuery("")

  }

  console.log("Jobs data:", Jobs);
  console.log("userid: ",user?.id);
  console.log("saved infor",Jobs?.saved);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
   //console.log(companies)
  return (
    <div className='flex flex-col'>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>
      {/*add filters here*/}

      <form onSubmit={handleSearch} className="flex h-14 w-full items-center gap-2 mb-4">
        <Input type="text" placeholder="Search Jobs by Title..."
        name="search-query"
        className="h-full flex-1 px-4 text-md "
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>
      
      <div className="flex flex-col sm:flex-row gap-2">
           <Select value={location} onValueChange={(value)=>setLocation(value)} >
      <SelectTrigger>
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

          <Select value={company_id} onValueChange={(value)=>setCompany_Id(value)} className="sm:w-5xl" >
      <SelectTrigger>
        <SelectValue placeholder="Filter by Company" />
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

        <Button onClick={clearfilters} variant="destructive" className="sm:w-1/2" >Clear Filter</Button>

      </div>




      {loadingjobs&& <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
      {loadingjobs===false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Jobs?.length?(
            Jobs.map((job) => {
              return (
                <JobCard key={job.id} job={job}
            savedInit={
          Array.isArray(job?.saved)&&
          job.saved.some(s => s.user_id === user?.id)
        }/>
              )
            })
          ):(
            <p className='text-center text-gray-500'>No jobs found.🤐</p>
          )
          }
          
        </div>
      )}
      {totalPages > 1 && (
      <Pagination className="mt-10">
        <PaginationContent>

          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Dynamic page numbers */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && setPage(page + 1)}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        
        </PaginationContent>
      </Pagination>
        )}


    </div>
  );
};

export default Joblisting;
