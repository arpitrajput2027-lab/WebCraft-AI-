import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
// import useGetCurrentUser from './hooks/useGetCurrentUser'
import WebsiteEditor from './pages/WebsiteEditor'
import Pricing from './pages/Pricing'
import Generate from './pages/Generate'
import { useSelector } from 'react-redux'



const App = () => {
  const {userData} = useSelector(state=>state.user)
  return (
    <BrowserRouter>   
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/generate' element={userData?<Generate/>:<Home/>}/>
         <Route path='/editor/:id' element={userData?<WebsiteEditor/>:<Home/>}/>
         <Route path='/pricing' element={<Pricing/>}/>
       </Routes>
    </BrowserRouter>
  )
}

export default App
