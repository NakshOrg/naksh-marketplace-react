import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@material/react-text-field/dist/text-field.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/uiComponents/Header';
import Routes from './routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <div className='app-content'>
          <Routes/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
