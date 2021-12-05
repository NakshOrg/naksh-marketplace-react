import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/uiComponents/Header';
import Routes from './routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes/>
      </BrowserRouter>
    </div>
  );
}

export default App;
