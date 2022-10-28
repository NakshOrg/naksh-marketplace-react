import { useEffect, useState } from "react";
import { useAppContext } from "../context/wallet";
import { config } from "dotenv";

config();

export const useFiat = () => {
  // console.log(process.env.REACT_APP_API_KEY, "Dsa")
  const { evmWalletData } = useAppContext();

  const [token, setToken] = useState(
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  );
  const [fiat, setFiat] = useState(false);
  const [amount, setAmount] = useState("100");
  const [widget, setWidget] = useState();

  useEffect(() => {
    if (window && window.onMetaWidget) {
      let createWidget = new window.onMetaWidget({
        elementId: "widget", // Mandatory (It should be an id of an element not a class)
        apiKey: process.env.REACT_APP_API_KEY, // Mandatory
      });

      setWidget(createWidget);

      createWidget.on("SUCCESS", () => {
        alert("payment is successful");
      });

      createWidget.on("FAILED", () => {
        alert("payment is not successful");
      });
    }
  }, [window]);

  useEffect(() => {
    if (fiat) {
      const fiatAmount = Number(amount) < 100 ? "100" : amount;
      
      if (widget && widget.fiatAmount && widget.fiatAmount === fiatAmount) {
        // widget.init();

        return;
      } else {
        
      }

      let createWidget = new window.onMetaWidget({
        elementId: "widget", // Mandatory (It should be an id of an element not a class)
        apiKey: process.env.REACT_APP_API_KEY, // Mandatory
        walletAddress: evmWalletData.address, // Optional
        fiatAmount: Number(amount) < 100 ? "100" : amount, // Optional (If passed then minimum amount is 100 inr)
        chainId: 137, // Optional (it should be passed along with the tokenAddress to show a particular token to the user)
        tokenAddress: token, // Optional
      });
      // console.log(createWidget)

      setWidget(createWidget);

      createWidget.init();
    } else {
    }
  }, [fiat]);

  return {
    fiat,
    setFiat,
    setAmount,
  };
};
