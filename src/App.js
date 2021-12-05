import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Routes from './routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </div>
  );
}

export default App;
