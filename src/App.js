import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamCapture from "./WebcamCapture";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div>
        <WebcamCapture />
      </div>
    </div>
  );
}

export default App;
