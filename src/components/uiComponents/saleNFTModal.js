import "./uiComponents.css";
import { useNFTs } from "../../hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import polygon from "../../assets/svgs/white-polygon-logo.svg";

const SaleNFTModal = ({ isOpen, setIsOpen, nft }) => {
	const { listNFT } = useNFTs();

	const [value, setValue] = useState('');
	const [selectedValue, setSelectedValue] = useState(0);
	const [auctionTime, setAuctionTime] = useState(1);

	const listNft = async () => {
		if (selectedValue === 0) {
			// set nft on sale (fixed price)
			await listNFT(nft, selectedValue, {
				price: ethers.utils.parseEther(value),
			});
		} else {
			const currDate = new Date();
			const currUnix = currDate.getTime() / 1000;

			currDate.setDate(currDate.getDate() + auctionTime);
			const nextUnix = currDate.getTime() / 1000;

			// auction nft
			// set nft on sale (time duration)
			await listNFT(nft, selectedValue, {
				price: ethers.utils.parseEther(value),
				auctionTime: nextUnix - currUnix,
			});
		}
		window.location.reload(false);
	};

	return (
    <div className="bg-[#12192B] space-y-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/2 lg:w-1/3 h-11/12 rounded-xl p-3 flex flex-col justify-center items-center">
      <h1
        className="text-5xl font-bold p-4"
        style={{
          fontFamily: "Athelas-Bold",
        }}
      >
        NFT Listing
      </h1>
      <div className="font-inter w-full h-36 space-x-3 p-3 flex justify-center items-center">
        <div className="w-1/3 h-full flex justify-start items-center font-bold text-xl font-inter">
          Pricing Type
        </div>
        <div
          onClick={() => setSelectedValue(0)}
          className={
            "relative cursor-pointer w-1/3 h-full text-bold  rounded-xl flex flex-col justify-center items-center" +
            (selectedValue === 0 ? " gradient" : "")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-md md:text-lg lg:text-xl text-center">
            Fixed Price
          </span>
        </div>
        <div
          onClick={() => setSelectedValue(1)}
          className={
            "cursor-pointer w-1/3 h-full text-bold border-2 border-white rounded-xl flex flex-col justify-center items-center" +
            (selectedValue === 1 ? " gradient" : "")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-md md:text-lg lg:text-xl px-2 text-center">
            Timed Auction
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center p-3 space-y-4">
        <div className="p-4 rounded-xl space-y-4 bg-[#24293C] w-full h-fit flex flex-col justify-around items-around">
          <label className="text-gray-600" htmlFor="">
            Enter minimum bid
          </label>
          <div className="flex justify-between items-center">
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
                color: "#fff",
              }}
              contentEditable={true}
            />
            <img src={polygon} className="w-5 h-5" />
          </div>
        </div>
        {selectedValue === 1 && (
          <div className="p-4 rounded-xl space-y-4 bg-[#24293C] w-full h-fit flex flex-col justify-around items-around">
            <label className="text-gray-600" htmlFor="">
              Expiration Date
            </label>
            <div className="flex justify-around items-cneter">
              <input
                value={auctionTime}
                onChange={(e) => setAuctionTime(Number(e.target.value))}
                type="number"
                className="w-full h-full bg-transparent"
              />
              <span>Days</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 rounded-xl space-x-4 w-full h-fit flex justify-center items-center">
        <div
          onClick={() => setIsOpen(false)}
          className="tracking-widest font-semibold cursor-pointer w-1/2 h-full p-3 text-center text-xl border-2 border-white rounded-xl"
        >
          CANCEL
        </div>
        <div
          onClick={() => listNft()}
          className="tracking-widest font-semibold cursor-pointer w-1/2 h-full p-3 text-center text-xl bg-white text-black text-bold rounded-xl"
        >
          SUBMIT
        </div>
      </div>
    </div>
  );
};

export default SaleNFTModal;
