import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const AppLayout = () => {
  return (
    <div >
        <div className='grid-container'></div>
        <main className='min-h-screen container mx-auto px-4 '>
            <Header/>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default AppLayout