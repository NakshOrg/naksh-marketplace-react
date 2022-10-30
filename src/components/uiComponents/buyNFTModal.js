import "./uiComponents.css";
import { useNFTs } from "../../hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { ethers } from "ethers";
import polygon from "../../assets/svgs/white-polygon-logo.svg";

const BuyNFTModal = ({ isOpen, setIsOpen, nft, price, saleData, erc721 }) => {
	const { buyNFT, buyNFTonSale, buyNFTonSale1155 } = useNFTs();
	const [badValue, setBadValue] = useState(false)
  const [quantity, setQuantity] = useState("1")
	
	const buyNFTWrapper = async () => {
    if(erc721) {
      if(saleData.saleType === "0" || saleData.saleType === 0) {
        await buyNFTonSale(nft, nft.nftAddress, nft.tokenId, price)
      } else {
        await buyNFT({address: nft.nftAddress, ...nft}, ethers.utils.parseEther(value).toString(), price.toString())
      }
    } else {
      if(saleData.saleType === "0" || saleData.saleType === 0) {
        await buyNFTonSale1155(nft, nft.nftAddress, nft.tokenId, price, nft.owner, Number(quantity))
      }
    }
		window.location.reload(false);
	}
	const [value, setValue] = useState(
    saleData.auction && saleData.auction.highestBid
      ? ethers.utils.formatEther(saleData.auction.highestBid.toString())
      : ethers.utils.formatEther(price.toString())
  );

	return (
    <div className="bg-[#12192B] space-y-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/2 lg:w-1/3 h-11/12 rounded-xl p-2 flex flex-col justify-center items-center">
      <h1
        className="font-bold text-4xl pt-3"
        style={{
          fontFamily: "Athelas-Bold",
        }}
      >
        {saleData.saleType.toString() === "0" ? "Buy NFT" : "Place an offer"}
      </h1>
      <p className="text-xl">
        {saleData.saleType.toString() === "0"
          ? `You are about to buy ${nft.title}`
          : `You are about to bid to ${nft.title}`}
      </p>
      <div
        className="walletCardFlex"
        style={{ flexDirection: "column", marginTop: "30px" }}
      >
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "10px",
            marginBottom: "20px",
            background: "#24293C",
            backdropFilter: "blur(96.1806px)",
          }}
        >
          {saleData.saleType.toString() !== "0" ? (
            <input
              value={value}
              onChange={(e) => {
                let val = e.target.value;

                if (isNaN(Number(val))) return;

                setValue(val);
              }}
              type="text"
              className="text-xl"
              style={{
                width: "80%",
                padding: "10px",
                background: "transparent",
                color: badValue ? "red" : "#fff",
              }}
            />
          ) : (
            <div
              className="text-xl"
              style={{
                width: "80%",
                padding: "10px",
                background: "transparent",
                color: badValue ? "red" : "#fff",
              }}
            >
              {Number(value) * Number(quantity ? quantity : "1")}
            </div>
          )}
          <img src={polygon} className="ml-2 w-5 h-5" />
        </div>
        {!erc721 && (
          <div
            style={{
              width: "80%",
              marginBottom: "20px",
              background: "#24293C",
              backdropFilter: "blur(96.1806px)",
              padding: "10px",
            }}
          >
            <span className="text-gray-500 text-sm p-3">Quantity</span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <input
                value={quantity}
                onChange={(e) => {
                  let val = e.target.value;

                  if (isNaN(Number(val))) return;

                  setQuantity(val);
                }}
                placeholder="Quantity"
                type="text"
                className="text-xl"
                style={{
                  width: "80%",
                  padding: "10px",
                  background: "transparent",
                  color: "#fff",
                }}
              />
              <img src={polygon} className="invisible ml-2 w-5 h-5" />
            </div>
          </div>
        )}
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "20px",
            color: "#eee",
          }}
        >
          <p
            className="text-lg"
            style={{
              width: "100%",
            }}
          >
            {saleData.saleType.toString() === "0" ? "Price" : "Minimum Offer"}
          </p>
          <div className="w-full lg:w-1/2 flex justify-end items-center space-x-1">
            <p className="text-xl">
              {ethers.utils.formatEther(price.toString())}
            </p>{" "}
            <img src={polygon} className="ml-2 w-5 h-5" />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "80%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "20px",
          color: "#eee",
        }}
      >
        <div
          onClick={() => setIsOpen(false)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #fff",
            cursor: "pointer",
            width: "80%",
            margin: "10px",
            textAlign: "center",
          }}
        >
          CANCEL
        </div>
        <div
          onClick={() => buyNFTWrapper()}
          style={{
            padding: "10px",
            background: "#fff",
            color: "#000",
            cursor: "pointer",
            borderRadius: "10px",
            width: "80%",
            margin: "10px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {saleData.saleType === "0" || saleData.saleType === 0
            ? "BUY NFT"
            : "SUBMIT OFFER"}
        </div>
      </div>
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "absolute",
          right: "55px",
          top: "45px",
          cursor: "pointer",
        }}
      >
        <FiX className="text-2xl" />
      </div>
    </div>
  );
};

export default BuyNFTModal;
