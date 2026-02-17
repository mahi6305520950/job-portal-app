import { Children, useState } from 'react'

import './App.css'
import { Button } from "@/components/ui/button"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '@/layouts/app-layouts'
import LandingPage from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Joblisting from './pages/job-listing'
import Myjobs from './pages/Myjobs'
import Postjob from './pages/Postjob'
import Savedjob from './pages/Savedjob'
import Job from './pages/job'
import JobPage from './pages/Job-page'
import { ThemeProvider } from './components/themes-provider'
import ProtectedRoute from './components/protected-route'



const router=createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
    {
      path:"/",
      element:<LandingPage/>
    },
    {
      path:"/onboarding",
      element:
      (<ProtectedRoute>
        <Onboarding/>
        </ProtectedRoute>
      )
    },
    {
      path:"/jobs",
      element:
      (<ProtectedRoute>
        <Joblisting/>
        </ProtectedRoute>
        )
    },
    {
      path:"/jobs/:id",
      element:(<ProtectedRoute><JobPage/></ProtectedRoute>)
    },
    {
      path:"/post-job",
      element:(<ProtectedRoute><Postjob/></ProtectedRoute>)
    },
    {
      path:"/saved-jobs",
      element:(<ProtectedRoute><Savedjob/></ProtectedRoute>)
    },
    {
      path:"/my-jobs",
      element:(<ProtectedRoute><Myjobs/></ProtectedRoute>)
    }

    ]
  }



])


function App() {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router}/>
    </ThemeProvider>

  
     

  )
}

export default App
