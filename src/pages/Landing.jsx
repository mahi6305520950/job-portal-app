
import React from 'react'
import { Link } from 'react-router-dom' 
import { Button } from '@/components/ui/button'
import defaultcompanies from "../data/defaultcompanies.json"
import faq from "../data/faq.json"
import { Carousel, CarouselItem,CarouselContent } from '@/components/ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import useFetch from '../hooks/use-fetch'
import { GetCompanies } from '../api/apiCompanies'
import { useEffect } from 'react'
import { useUser } from "@clerk/clerk-react";


const LandingPage = () => {
    const {isLoaded, user }=useUser();  

const { fn: fnCompanies, data: companies} =useFetch(GetCompanies);


const companyList = companies?.length ? companies : defaultcompanies;

 useEffect(() => {
    if(isLoaded) fnCompanies();
  }, [isLoaded]);

console.log("comapines landingpage",companies)
console.log("default companies",defaultcompanies)


  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-3 sm:py-4'>
      <section className='text-center'>
        <h1 className='flex flex-col items-center justify-center gradient-title font-extrabold       text-2xl sm:text-4xl lg:text-7xl tracking-tight py-2'>
          Find Your Dream Job 
          <span className="flex items-center ">and get 
            <img src="/logo.png" alt='logo' className='h-14 sm:h-30 lg:h-30' />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">Explore thousands of jobs listing or find perfect candidate</p>
      </section>
      <div className='flex gap-6 justify-center'>
        {/*button*/}
        <Link to="/jobs">
          <Button variant='blue' size='xl'>Find jobs</Button>
        </Link>
         <Link to="/post-job">
          <Button variant='destructive' size='xl'>Post a job</Button>
        </Link>
      </div>

      {/*corousel*/}
      <Carousel opts={{
    align: "start",
    loop: true,
  }}
  plugins={[
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    }),
  ]} className="w-full py-5">
      <CarouselContent className="flex gap-4 sm:gap-5 items-center">
       {companyList?.map((company)=>{
        return (
        <CarouselItem
  key={company.id}
  className="basis-1/3 lg:basis-1/6  flex items-center justify-center"
>
  <div className="h-15 p-1 w-full flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-md shadow-sm">
    <img
      src={company.logo_url}
      alt={company.name}
      className="max-h-12 max-w-[120px] object-contain"
    />
  </div>
</CarouselItem>

        )
       })}
      </CarouselContent>
    </Carousel>
      
      {/*banner*/}
       <img src="/banner.png" alt="banner" className='w-full h-auto'/>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* cards*/}
        <Card>
      <CardHeader>
        <CardTitle>For job Seekers</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Search and apply for jobs, track applications, and more...</p>
      </CardContent>
      </Card>
      <Card>
      <CardHeader>
        <CardTitle>For Employers</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Post job openings, manage applicants, and find the right talent...</p>
      </CardContent>
      </Card>
      </section>
      {/*accordion*/}
       <Accordion
      type="single"
      collapsible
    >
      {faq.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>


    </main> 

  )
}

export default LandingPage