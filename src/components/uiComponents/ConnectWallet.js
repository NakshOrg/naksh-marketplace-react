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

const WalletCard = ({ src, classNames, onClick }) => {
  return (
    <div>
      <img src={src} onClick={onClick} className={classNames} />
    </div>
  );
};

const ConnectWallet = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const walletInfo = useSelector((state) => state.nearReducer.walletInfo);
  const isWalletSignedIn = useSelector(
    (state) => state.nearReducer.isWalletSignedIn
  );
  const userData = useSelector((state) => state.nearReducer.userData);
  const searchResultsArtists = useSelector(
    (state) => state.dataReducer.searchResultsArtists
  );
  const searchResultsNfts = useSelector(
    (state) => state.dataReducer.searchResultsNfts
  );
  const loading = useSelector((state) => state.dataReducer.headerSearchLoading);

  const { evmWalletData, setEVMWalletData, setEVMProvider } = useAppContext();
  const { openConnectModal } = useConnectModal();

  const connectNear = async () => {
    const toastId = toast.loading("Connecting to Near");
    try {
      // console.log(walletInfo, "dsa")
      if (walletInfo) {
        walletInfo.requestSignIn({
          successUrl: configs.appUrl,
          failureUrl: `${configs.appUrl}/404`,
        });
      }
      toast.success("Successfully connected to Near", {
        id: toastId,
      });
      setIsOpen(false);
    } catch (e) {
      toast.error("Cannot connect to Near", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    if (evmWalletData && evmWalletData.signer) {
      setIsOpen(false);
    }
  }, [evmWalletData]);

  return (
    <div className="absolute walletCard">
      <h1
        className="font-bold text-5xl"
        style={{
          fontFamily: "Athelas-Bold",
        }}
      >
        Connect Wallet
      </h1>
      <p
        className="text-xl"
        style={{
          fontFamily: "Athelas-Regular",
        }}
      >
        Connect to one of our wallets to create a Naksh account and save this
        NFT!
      </p>
      <div className="walletCardFlex space-y-5 md:space-y-0">
        <WalletCard
          src={near}
          onClick={() => connectNear()}
          key={"Near"}
          classNames="p-0 m-0"
        />
        <WalletCard
          src={polygon}
          onClick={() => openConnectModal()}
          key={"Polygon"}
          classNames="p-0 m-0"
        />
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
        <FiX className="text-4xl" />
      </div>
    </div>
  );
};

export default ConnectWallet;
