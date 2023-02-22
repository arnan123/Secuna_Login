import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/Homescreen';
import LoginScreen from './screens/Signup';

function App() {
  return (
    <>
      <Routes>
        <Route path="/Home" element={<HomeScreen />} />
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </>
  );
}

export default App;
