import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InterRoutes from './Routes/Interface/UserInterface';
import React from "react";

const GOOGLE_CLIENT_ID= process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<InterRoutes />} />
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
