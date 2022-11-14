// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Authereum from "authereum";
import { ethers } from "ethers";
import { useAppContext } from "../context/wallet";
import { useSigner } from "wagmi";
import { useEffect } from "react";
import { _postArtist } from "../services/axios/api";
const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

export const useEVMWallet = () => {
  const {
    setEVMWallet,
    setEVMWalletData,
    setEVMProvider,
    setIsEVMWalletSignedIn,
  } = useAppContext();
  const { data: signer, isError, isLoading } = useSigner();

  useEffect(() => {
    (async () => {
      if (signer) {
        setIsEVMWalletSignedIn(true);
        setEVMWalletData({
          address: await signer.getAddress(),
          signer: signer,
        });
      }
    })();
  }, [signer]);

  const establishHarmonyConnection = async () => {
    if (typeof window !== "undefined") {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length !== 0) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = await provider.getSigner();

            setEVMWalletData({
              address: await signer.getAddress(),
              signer: signer,
            });
            setEVMProvider(provider);
          } else {
            // console.log("Do not have access");
          }
        } else {
          // console.log("Install Metamask");
        }
      } catch (e) {
        // console.log(e);
      }
    }

    // const providerOptions = {
    // 	walletconnect: {
    // 		package: WalletConnectProvider,
    // 		options: {
    // 			infuraId: INFURA_ID, // required
    // 		},
    // 	},
    // 	authereum: {
    // 		package: Authereum, // required
    // 	},
    // };

    // const web3modal = new Web3Modal({
    // 	providerOptions,
    // });

    // try {
    // 	setEVMWallet(web3modal);

    // 	// console.log(web3modal);
    // } catch (e) {
    // 	// console.log(e, "Error from harmony");
    // }
  };

  return {
    establishHarmonyConnection,
  };
};
