import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from 'react-ga';

import Header from './components/uiComponents/Header';
import Routes from './routes';
import reducer from './redux';
import { establishWalletConnection } from './redux/actions/actions';
import './App.css';

ReactGA.initialize('G-54RZ2BX11S');

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // near wallet connection
    dispatch(establishWalletConnection());
  }, []);

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

export default function AppWrapper() {

  const store = createStore(reducer, applyMiddleware(thunk));

  return (
    <Provider store={store}>
      <App/>
    </Provider>
  ) 
}


