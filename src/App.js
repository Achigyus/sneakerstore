import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, SneakerStore } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/app" element={<SneakerStore/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
