import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Mainlayout from '../Mainlayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Videomeet from '../pages/Videomeet';
import MeetingId from '../pages/MeetingId';
import Protectedroute from '../Protectedroute';
import Meetinghistory from '../pages/Meetinghistory';
import Guest from '../pages/temp';



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Mainlayout />}>
          <Route path='/' element={<Home />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/signup' element={<Signup />} ></Route>
          <Route path='/meet' element={<Protectedroute> <MeetingId /> </Protectedroute>} ></Route>
          <Route path='/meeting/:id' element={<Protectedroute> <Videomeet /> </Protectedroute>}></Route>
          <Route path='/history' element={<Protectedroute> <Meetinghistory /> </Protectedroute>}></Route>
          <Route path='/guest' element={<Guest />}></Route>



        </Route>

      </Routes>
    </BrowserRouter>


  )
}

export default App
