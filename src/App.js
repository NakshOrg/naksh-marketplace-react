import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from 'react-ga4';
import { Toaster } from 'react-hot-toast';

import Header from './components/uiComponents/Header';
import Routes from './routes';
import reducer from './redux';
import { establishWalletConnection } from './redux/actions/actions';
import './App.css';

// google analytics initialization
ReactGA.initialize('G-51GS0V4HX8');

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
      <Toaster
        containerStyle={{
          top: 90
        }}
        toastOptions={{
          success: {
            style: {
              background: "rgba(255, 255, 255, 0.6)",
              border: "2px solid #00D115",
              backdropRilter: "blur(17px)",
              borderRadius: 8
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
    </Provider>
  ) 
}


