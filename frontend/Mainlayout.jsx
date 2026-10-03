import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function Mainlayout() {
    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <Navbar/>
        

        <main className='flex-1 min-h-0 px-4'>
            <Outlet/>
        </main>
        </div>
        
    
       
        
        
    )
}

export default Mainlayout
