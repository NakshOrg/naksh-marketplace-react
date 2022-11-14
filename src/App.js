import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch } from "react-redux";
import thunk from "redux-thunk";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactGA from "react-ga4";
import { Toaster } from "react-hot-toast";
import "./output.css";
import Header from "./components/uiComponents/Header";
import Routes from "./routes";
import reducer from "./redux";
import { establishWalletConnection } from "./redux/actions/actions";
import "./App.css";
import { useEVMWallet } from "./hooks";
import { AppContext } from "./context/wallet";
import ConnectWalletContext from "./context/connectWallet";
import nakshAbi from "./interface/nakshAbi.json";
import factoryAbi from "./interface/factoryAbi.json";
import { ethers, BigNumber } from "ethers";
import { useScript } from "./hooks/useScript";
import { Helmet } from "react-helmet";
import { useSigner } from "wagmi";

// google analytics initialization
ReactGA.initialize("G-51GS0V4HX8");

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
        <Header />
        <div className="app-content">
          <Routes />
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
  const [isEVMWalletSignedIn, setIsEVMWalletSignedIn] = useState(false);
  const NAKSH_ADDRESS = "0x53c588d80207dDD5e16c9a5CF7E2943b230935c0";
  const NAKSH_FACTORY_ADDRESS = "0xfE4de797611F0C162aC3E6dB79fc71e852E9dEF2";
  const NAKSH_ADDRESS_1155 = "0x95c67cDB351172Ddc7e8ad8dd8f9EAe2b029C172";
  const NAKSH_FACTORY_ADDRESS_1155 =
    "0xF89D87320c82ffC7a31562fCDA8c2259898C47F0";

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d"
    );
    const contract1 = new ethers.Contract(NAKSH_ADDRESS, nakshAbi, provider);
    setNakshContract(contract1);

    const contract3 = new ethers.Contract(
      NAKSH_FACTORY_ADDRESS,
      factoryAbi,
      provider
    );
    setFactoryContract(contract3);
  }, []);

  useEffect(() => {
    (async () => {
      if (evmWalletData && evmWalletData.signer) {
        const contract1 = new ethers.Contract(
          NAKSH_ADDRESS,
          nakshAbi,
          evmWalletData.signer
        );
        setNakshContract(contract1);

        const contract3 = new ethers.Contract(
          NAKSH_FACTORY_ADDRESS,
          factoryAbi,
          evmWalletData.signer
        );
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
    NAKSH_FACTORY_ADDRESS,
    NAKSH_ADDRESS_1155,
    NAKSH_FACTORY_ADDRESS_1155
  };

  // useEffect(() => {
  //   // console.log(window)
  //   if(window && window.onMetaWidget) {
  //     let createWidget = new window.onMetaWidget({
  //       elementId: "widget", // Mandatory (It should be an id of an element not a class)
  //       apiKey: "0e20a0de-7850-41c0-8fff-b80dbb3e17e4", // Mandatory
  //     })
  //     createWidget.init()
  //   }
  // }, [window])

  return (
    <ConnectWalletContext>
      <AppContext.Provider value={stateValue}>
        <Provider store={store}>
          <Helmet>
            <script
              src="https://platform.onmeta.in/onmeta-sdk.js"
              type="text/javascript"
            ></script>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" /> 
          </Helmet>
          <App />
          <Toaster
            containerStyle={{
              top: 90,
            }}
            toastOptions={{
              success: {
                style: {
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "2px solid #00D115",
                  backdropRilter: "blur(17px)",
                  borderRadius: 8,
                },
              },
              error: {
                style: {
                  background: "red",
                },
              },
            }}
          />
        </Provider>
      </AppContext.Provider>
    </ConnectWalletContext>
  );
}
