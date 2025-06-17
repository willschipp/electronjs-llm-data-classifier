import { useState } from 'react'
import './App.css'

import { HashRouter as Router, Route, Routes } from 'react-router-dom'; //routing

import Navigation from './components/Navigation';
import Home from './components/Home';
import Upload from './components/Upload';
import RawText from './components/RawText';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/raw" element={<RawText/>}/>
          <Route path="/upload" element={<Upload/>}/>
        </Routes>
        <Navigation/>
      </Router>
    </>
  )
}

export default App
