import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; //routing

import Navigation from './components/Navigation';
import Home from './components/Home';
import Upload from './components/Upload';
import RawText from './components/RawText';

function App() {

  return (
    <>
      <Home/>
      <RawText/>
      {/* <Upload/> */}
      <Navigation/>
      {/* <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
        </Routes>
      </Router> */}
    </>
  )
}

export default App
