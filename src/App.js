import React from 'react';
import logo from './logo.svg';
import './App.css';
import CameraCapture from "./CameraCapture";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div>
        <CameraCapture />
      </div>
    </div>
  );
}

export default App;
