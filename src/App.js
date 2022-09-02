import './App.css';
import React from 'react';
import { CeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, WrappedSneaker } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/app" element={<WrappedSneaker/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
