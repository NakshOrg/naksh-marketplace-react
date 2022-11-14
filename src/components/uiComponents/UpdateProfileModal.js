import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { FiX } from "react-icons/fi";
import polygon from "../../assets/images/polygon.png";
import near from "../../assets/images/near.png";
// import near from "../../assets/svgs/connect-near.svg";
import configs from "../../configs";
import { ethers } from "ethers";
import { connectHarmonyWallet } from "../../redux/actions/actions";
import "./uiComponents.css";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/wallet";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { OutlineBtn } from "./Buttons";

const UpdateProfileModal = ({ isOpen, setIsOpen }) => {
  const history = useHistory();

  return (
    <div className="absolute walletCard py-10 px-14">
      <h1
        className="font-bold text-4xl m-4 mb-3"
        style={{
          fontFamily: "Athelas-Bold",
        }}
      >
        Complete Your Profile
      </h1>
      <p className="text-md md:text-xl text-center mb-3 md:mb-5 font-inter">
        You need to update your profile to start minting!
      </p>
      <div className="walletCardFlex mb-5 md:mb-0 space-y-5 md:space-y-0 space-x-0 md:space-x-5">
        <div onClick={() => setIsOpen(false)} className="cursor-pointer w-full p-3 text-center bg-transparent tracking-widest text-inter font-bold border border-white rounded-lg">
          CANCEL
        </div>
        <div onClick={() => {
            history.push("/editprofile");
            setIsOpen(false)
        }} className="cursor-pointer w-full p-3 text-center bg-white text-black tracking-widest text-inter font-bold rounded-lg">
          UPDATE PROFILE
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
