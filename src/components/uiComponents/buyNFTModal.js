import "./uiComponents.css";
import { useNFTs } from "../../hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { ethers } from "ethers";

const BuyNFTModal = ({ isOpen, setIsOpen, nft, price, saleData }) => {
	const { buyNFT, buyNFTonSale } = useNFTs();
	
	const buyNFTWrapper = async () => {
		if(saleData.saleType === "0" || saleData.saleType === 0) {
			await buyNFTonSale(nft, nft.nftAddress, nft.tokenId, price)
		} else {
			await buyNFT({address: nft.nftAddress, ...nft}, value, price.toString())
		}
		// window.location.reload(false);
	}
	const [value, setValue] = useState(saleData.auction && saleData.auction.highestBid ? saleData.auction.highestBid : price);

	return (
		<div className="bg-[#12192B] space-y-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-11/12 rounded-xl p-2 flex flex-col justify-center items-center">
			<h1 className="font-bold text-4xl pt-3" style={{
				fontFamily:"Athelas-Bold"
			}}>Place an offer</h1>
			<p className="text-xl" style={{
				fontFamily:"Athelas-Bold"
			}}>You are about to bid to {nft.title}</p>
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
						fontFamily:"Athelas-Bold"
					}}
				>
					<input
						value={ethers.utils.formatEther(value.toString())}
						onChange={(e) => setValue(ethers.utils.parseEther(e.target.value))}
						type="number"
						className="text-xl"
						style={{
							width: "80%",
							padding: "10px",
							background: "transparent",
							color: "#fff",
						}}
					/>
					MATIC
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
					<p
						className="text-lg"
						style={{
							width: "80%",
							fontFamily:"Athelas-Bold"
						}}
					>
						Minimum Offer
					</p>
					<div className="w-1/2 flex justify-end items-center space-x-1">
						<p className="text-xl" style={{
							fontFamily:"Athelas-Bold"
						}}>{ethers.utils.formatEther(price.toString())}</p>
						{' '}
						<span style={{fontFamily:"Athelas-Bold"}} className="text-xs">MATIC</span>
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
						fontFamily:"Athelas-Bold"
					}}
				>
					Cancel
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
						fontFamily:"Athelas-Bold"
					}}
				>
					{saleData.saleType === "0" || saleData.saleType === 0 ? "Buy NFT" : "SUBMIT OFFER"}
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
