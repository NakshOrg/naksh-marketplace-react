import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from 'react-ga4';
import { Toaster } from 'react-hot-toast';
import "./output.css"
import Header from './components/uiComponents/Header';
import Routes from './routes';
import reducer from './redux';
import { establishWalletConnection } from './redux/actions/actions';
import './App.css';
import { useEVMWallet } from './hooks';
import { AppContext } from './context/wallet';
import ConnectWalletContext from "./context/connectWallet"
import nakshAbi from "./interface/nakshAbi.json";
import factoryAbi from "./interface/factoryAbi.json";
import { ethers, BigNumber } from "ethers";


// google analytics initialization
ReactGA.initialize('G-51GS0V4HX8');

function App() {
  const { establishHarmonyConnection } = useEVMWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    // near wallet connection
    dispatch(establishWalletConnection());
  }, []);

  useEffect(() => {
		establishHarmonyConnection();
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

  const [evmWallet, setEVMWallet] = useState();
	const [evmWalletData, setEVMWalletData] = useState();
	const [evmProvider, setEVMProvider] = useState();
	const [nakshContract, setNakshContract] = useState();
	const [factoryContract, setFactoryContract] = useState();
  const [isEVMWalletSignedIn, setIsEVMWalletSignedIn] = useState(false)
	const NAKSH_ADDRESS = "0xa498DC2D425d74C6c63C9A5b9075b6d0ef2C279b";
	const NAKSH_FACTORY_ADDRESS = "0x613237e16EFCadAd62439A4ecA910bC36F4Da49a";

  useEffect(() => {
		const provider = new ethers.providers.JsonRpcProvider(
			"https://polygon-mumbai.g.alchemy.com/v2/Tv9MYE2mD4zn3ziBLd6S94HvLLjTocju"
		);
		const contract1 = new ethers.Contract(NAKSH_ADDRESS, nakshAbi, provider);
		setNakshContract(contract1);

		const contract3 = new ethers.Contract(NAKSH_FACTORY_ADDRESS, factoryAbi, provider);
		setFactoryContract(contract3);
	}, []);

  useEffect(() => {
		(async () => {
			if (evmWalletData && evmWalletData.signer) {
				const contract1 = new ethers.Contract(NAKSH_ADDRESS, nakshAbi, evmWalletData.signer);
				setNakshContract(contract1);

				const contract3 = new ethers.Contract(NAKSH_FACTORY_ADDRESS, factoryAbi, evmWalletData.signer);
				setFactoryContract(contract3);
			}
		})();
	}, [evmWalletData]);

  const stateValue = {
		evmWallet,
		setEVMWallet,
		evmWalletData,
		setEVMWalletData,
		evmProvider,
		setEVMProvider,
		nakshContract,
		setNakshContract,
		factoryContract,
		setFactoryContract,
    isEVMWalletSignedIn,
    setIsEVMWalletSignedIn,
		NAKSH_ADDRESS,
		NAKSH_FACTORY_ADDRESS
	};

  return (
    <ConnectWalletContext>
      <AppContext.Provider value={stateValue}>
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
      </AppContext.Provider>
    </ConnectWalletContext>
  ) 
}


