import { useState } from 'react'
import './App.css'

import { HashRouter as Router, Route, Routes } from 'react-router-dom'; //routing

import { Section } from  "@blueprintjs/core";

import Navigation from './components/Navigation';
import Home from './components/Home';
import Upload from './components/Upload';
import RawText from './components/RawText';
import Classifications from './components/Classifications';

function App() {

  return (
    <>
      <Router>
        <Section style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/raw" element={<RawText/>}/>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="/classifications" element={<Classifications/>}/>
          </Routes>
        </Section>
        <Navigation/>        
      </Router>
    </>
  )
}

export default App
