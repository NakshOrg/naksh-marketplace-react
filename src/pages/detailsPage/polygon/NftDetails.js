import React, { Component, Fragment, useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FiBookmark,
  FiExternalLink,
  FiMoreVertical,
  FiX,
} from "react-icons/fi";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import uuid from "react-uuid";
import polygon from "../../../assets/svgs/white-polygon-logo.svg"
import { ethers } from "ethers";

import NftCard from "../../../components/explore/NftCard";
import { GradientBtn } from "../../../components/uiComponents/Buttons";
import Spinner from "../../../components/uiComponents/Spinner";
import nearIcon from "../../../assets/svgs/near-icon.svg";
import party from "../../../assets/svgs/party.svg";
import profileSvg from "../../../assets/svgs/profile-icon-big.svg";
import globalStyles from "../../../globalStyles";
import classes from "../details.module.css";
import { helpers } from "../../../constants";
import { _getNftArtists } from "../../../services/axios/api";
import Modal from "../../../components/uiComponents/Modal";
import { useNFTs } from "../../../hooks";
import { useAppContext } from "../../../context/wallet";
import BuyNFTModal from "../../../components/uiComponents/buyNFTModal";
import { BigNumber } from "ethers/lib/ethers";
import SaleNFTModal from "../../../components/uiComponents/saleNFTModal";
import { useTrendingNFTs } from "../../../hooks/useTrendingNFTs";
import { useFiat } from "../../../hooks/useFiat";
import axios from "axios";
import { useSavedNFTs } from "../../../hooks/useSavedNFTs";
import useCollection from "../../../hooks/useCollection";

export default function PolygonNftDetails(props) {
  const {
    getNFT,
    getNFTsOnSale,
    buyNFT,
    endAuction,
    getNFTOwners,
    cancelSale,
  } = useNFTs();
  const { nakshContract, evmWalletData, NAKSH_ADDRESS_1155 } = useAppContext();
  const { updateTrendingNFT } = useTrendingNFTs();

  const { setFiat, setAmount, fiat } = useFiat();
  const { saveNFT, removeNFT } = useSavedNFTs();

  const convertAmountToMatic = async (price) => {
    try {
      //   console.log(price);
      const fromURL = `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr`;

      const res = await axios({
        url: fromURL,
      });

      const data = res.data;

      if (data && data["matic-network"] && data["matic-network"].inr) {
        return data["matic-network"].inr * price;
      }


      throw new Error("Can't find price at the moment");
    } catch (e) {
      alert(e.message);
    }
  };

  const params = useParams();
  const history = useHistory();
  const { getCollection } = useCollection()

  useEffect(() => updateTrendingNFT(params.address, params.id), []);

  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [moreNfts, setMoreNfts] = useState([]);
  const [isOverviewActive, setIsOverviewActive] = useState(1);
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [saleData, setSaleData] = useState();
  const [artist, setArtist] = useState();
  const [savedNft, setSavedNft] = useState(false);
  const [user, setUser] = useState();
  const [collection, setCollection] = useState()
  const [owners, setOwners] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)

  const [auctionData, setAuctionData] = useState({});
  const [bids, setBids] = useState([]);

  const [purchasable, setPurchasable] = useState({
    owner: false,
    auctionEnded: false,
  });

  useEffect(() => {
    if (nft) {
      try {
        _getNftArtists({
          artist: ethers.utils.getAddress(nft.creator),
          owner: ethers.utils.getAddress(nft.owner),
        }).then(({ data: { artist, owner } }) => {
          console.log(artist.image, "dasdsafwrw");
          setArtist(artist);
          setOwnerData(owner);
        });
      } catch (e) {console.log(e, "dasdsafwrw");}
    }
  }, [nft]);

  useEffect(() => {
    if (evmWalletData) {
      _getNftArtists({
        artist: ethers.utils.getAddress(evmWalletData.address),
        owner: ethers.utils.getAddress(evmWalletData.address),
      }).then(({ data: { artist, owner } }) => {
        setUser(artist);
        const nfts = artist?.savedNft;

        if (nfts.length > 0) {
          const found = nfts.find(
            (nft) => nft.address === params.address && nft.token === params.id
          );

          if (found) setSavedNft(true);
        }
      });
    }
  }, [evmWalletData]);

  useEffect(() => {
    if (
      saleData &&
      saleData.auction &&
      saleData.auction.bids &&
      saleData.auction.bids.length > 0
    ) {
      const bids = saleData.auction.bids.sort(
        (bid1, bid2) => bid2.timestamp - bid1.timestamp
      );
      setBids(bids);
    }
  }, [saleData]);

  useEffect(() => {
    if(collection) {
      if(!collection.erc721) {
        getNFTOwners(params.address, params.id)
          .then(res => {
            const copy = res
              .slice()
              .filter(
                (item) => item.owner.toLowerCase() !== NAKSH_ADDRESS_1155.toLowerCase()
              );
            let totalQuantity = 0
            res.map(nft => totalQuantity += Number(nft.quantity))
            setTotalQuantity(totalQuantity)
            setOwners(copy)
          })
      }
    }
  }, [collection])

  // useEffect(() => {
  // 	if (nft && nft.tokenId) {
  // 		getBids(nft.tokenId)
  // 			.then((res) => setBids(res))
  // 			.catch((e) => console.error(e));
  // 	}
  // }, [nft]);

  useEffect(() => {
    if (evmWalletData && nft && nft.owner) {
      if (saleData) {
        setPurchasable({
          owner:
            nft.owner.toLowerCase() === evmWalletData.address.toLowerCase(),
          auctionEnded:
            saleData.saleType == "0"
              ? Number(saleData.salePrice) <= 0
              : saleData.auction.endTime <= new Date().getTime() / 1000,
        });
      } else {
        setPurchasable({
          owner:
            nft.owner.toLowerCase() === evmWalletData.address.toLowerCase(),
          auctionEnded: true,
        });
      }
    }
    // console.log(saleData, "salleeeeeeeeeeee");
  }, [evmWalletData, nft, saleData]);

  // useEffect(() => {
  // 	(async () => {
  // 		if (auctionContract && nft) {
  // 			console.log(nft, "nft");
  // 			const auctionDatax = await auctionContract.auctionData(
  // 				params.address,
  // 				BigNumber.from(params.id)
  // 			);

  // 			if(auctionDatax.owner !== ethers.constants.AddressZero) setAuctionData(auctionDatax);
  // 		}
  // 	})();
  // }, [nakshContract, nft]);

  useEffect(() => {
    if (nakshContract && evmWalletData && evmWalletData.signer) {
      setLoading(true);
      fetchNft();
    }
  }, [nakshContract, evmWalletData]);

  // useEffect(() => {
  // 	if (nakshContract) {
  // 		setLoading(true);
  // 		fetchNft();
  // 	}
  // }, [location.pathname]);

  // const handleOnSubmit = async () => {
  //     const response = await fetch(nft.metadata.media);
  //     // here image is url/location of image
  //     const blob = await response.blob();
  //     const file = new File([blob], 'share.jpg', {type: blob.type});
  //     console.log(file);
  //     if(navigator.share) {
  //       await navigator.share({
  //         title: this.state.nft.metadata?.title,
  //         text: "Take a look at my beautiful nft",
  //         url: window.location.href,
  //         files: [file]
  //       })
  //         .then(() => console.log('Successful share'))
  //         .catch((error) => console.log('Error in sharing', error));
  //     }else {
  //       console.log(`system does not support sharing files.`);
  //     }
  // }

  const fetchNft = async () => {
    try {
      setLoading(true);
      const nfts = await getNFTsOnSale();

      const nft = await getNFT(params.address, params.id);
      //   console.log(nft, "nft");

      //   console.log(nfts, "nffff");
      const moreNfts = nfts.filter(
        (item) =>
          item.nft.tokenId.toString() !== params.id ||
          item.nft.nftAddress.toLowerCase() !== params.address.toLowerCase()
      );

      const foundNft = nfts.find(
        (item) =>
          item.nft.tokenId.toString() === params.id &&
          item.nft.nftAddress.toLowerCase() === params.address.toLowerCase()
      );
      setPrice(foundNft ? Number(foundNft.salePrice) : 0);
      setSaleData(foundNft);

      getCollection(nft.nftAddress)
        .then(collection => {
          if(collection) setCollection(collection)
          else setCollection({ erc721: true, name: 'Generic' })
        })

      setNft(nft);
      setMoreNfts(moreNfts);
      setLoading(false);
    } catch (e) {
        console.log(e, "Er");
      alert("something went wrong!");
      setLoading(false);
    }
  };

  const handleBuyNft = async () => {
    if (evmWalletData) {
      await buyNFT(nft);
    }
  };

  const updateSavedNFT = async () => {
    savedNft
      ? await removeNFT(user?._id, {
          blockchain: 1,
          token: params.id,
          address: params.address,
        })
      : await saveNFT(user?._id, {
          blockchain: 1,
          token: params.id,
          address: params.address,
        });

    window.location.reload();
  };

  const cancelSales = async () => {
    await cancelSale(params.address, params.id, Number(saleData.quantity));
    window.location.reload();
  };

  const buyMatic = async () => {
    // console.log("Das");
    if (saleData && saleData.salePrice) {
      const amount = await convertAmountToMatic(
        Number(ethers.utils.formatEther(saleData.salePrice))
      );
      setAmount(amount);
      setFiat(true);
    } else {
      //   console.log(true);
      setFiat(true);
    }
  };

  const overview = () => {
    return (
      <>
        <div
          style={{
            fontWeight: 200,
            lineHeight: "25px",
            letterSpacing: "0.3px",
            marginTop: 20,
            opacity: 0.95,
          }}
        >
          {nft?.description}
        </div>
        {/* line seperator */}
        <div
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#fff",
            opacity: 0.16,
            marginTop: 7,
          }}
        />
        <div style={{ marginTop: 14, ...globalStyles.flexRow }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.66 }}>Quantity</div>
            {nft?.erc721 ? (
              <div
                style={{
                  fontFamily: 200,
                  fontSize: 16,
                  opacity: 0.95,
                  marginTop: 5,
                  letterSpacing: "0.5px",
                }}
              >
                {nft?.quantity} available{" "}
                {saleData ? <span> and {saleData.quantity} on sale</span> : ""}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: 200,
                  fontSize: 16,
                  opacity: 0.95,
                  marginTop: 5,
                  letterSpacing: "0.5px",
                }}
              >
                {totalQuantity} available{" "}
              </div>
            )}
          </div>
          <div style={{ marginLeft: 30 }}>
            <div style={{ fontSize: 14, opacity: 0.66 }}>Collection</div>
            <div
              style={{
                fontFamily: 200,
                fontSize: 16,
                opacity: 0.95,
                marginTop: 5,
                letterSpacing: "0.5px",
              }}
            >
              {collection?.name}
            </div>
          </div>
        </div>
        {/* <div style={{marginTop:18, fontWeight:400}}>
                <div style={{fontSize:14, opacity:0.66}}>Proof of authenticity</div>
                <div style={{marginTop:5}}>
                    <span style={{marginRight:10, borderBottom:"1px solid #fff", paddingBottom:1}}>kaer10202kaskdhfcnzaleleraoao</span>
                    <span><FiExternalLink size={22} color='#fff'/></span>
                </div>
            </div> */}
        {/* line seperator */}
        <div
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#fff",
            opacity: 0.16,
            marginTop: 15,
          }}
        />
        <div style={{ marginTop: 14, ...globalStyles.flexRow }}>
          <div>
            <div
              style={{
                fontSize: 14,
                opacity: 0.66,
                marginBottom: 6,
              }}
            >
              Artist
            </div>
            <div
              onClick={() => history.push(`/ourartists/${artist?._id}`)}
              style={{
                ...globalStyles.flexRow,
                cursor: "pointer",
              }}
            >
              {nft?.erc721 ? (
                <>
                  <img
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 30,
                      objectFit: "cover",
                    }}
                    src={
                      artist
                        ? artist.image
                        : nft?.artistImg
                        ? nft?.artistImg
                        : profileSvg
                    }
                    alt="artist"
                  />
                  <div style={{ fontSize: 16, marginLeft: 10 }}>
                    {artist ? artist.name : nft?.artistName.substring(0, 15)}
                  </div>
                </>
              ) : (
                <>
                  <img
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 30,
                      objectFit: "cover",
                    }}
                    src={profileSvg}
                    alt="artist"
                  />
                  <div style={{ fontSize: 16, marginLeft: 10 }}>Multiple</div>
                </>
              )}
            </div>
          </div>
          <div style={{ marginLeft: 30 }}>
            <div
              style={{
                fontSize: 14,
                opacity: 0.66,
                marginBottom: 6,
              }}
            >
              Owner(s)
            </div>
            {nft?.erc721 ? (
              <div style={globalStyles.flexRow}>
                <img
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    objectFit: "cover",
                  }}
                  src={ownerData?.image ?? profileSvg}
                  alt="artist"
                />
                <div
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    wordBreak: "break-word",
                  }}
                >
                  {nft?.owner_id}
                </div>
              </div>
            ) : (
              <div style={globalStyles.flexRow}>
                <img
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    objectFit: "cover",
                  }}
                  src={profileSvg}
                  alt="artist"
                />
                <div
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    wordBreak: "break-word",
                  }}
                >
                  Multiple
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const otherDetails = () => {
    return (
      <>
        {collection?.erc721 ? (
          <span></span>
        ) : (
          <div>
            <div style={{ marginTop: 14, ...globalStyles.flexRow }}>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    opacity: 0.66,
                    marginBottom: 6,
                  }}
                >
                  Owners
                </div>
                {owners.map((owner) => (
                  <div
                    onClick={() => history.push(`/polygon/${owner.owner}/${params.address}/${params.id}`)}
                    style={{
                      ...globalStyles.flexRow,
                      cursor: "pointer",
                    }}
                    className="py-1"
                  >
                    <div style={{ fontSize: 16, marginLeft: 10 }}>
                      {owner.owner.substring(0, 8)}...
                    </div>
                    <div style={{ fontSize: 16, marginLeft: 10 }}>
                      Owns {owner.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* {nft?.metadata?.extra?.materialMediumUsed &&
            <div style={{marginTop:20}}>
                <div style={{fontSize:14, opacity:0.66}}>Material Medium Used</div>
                <div style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, letterSpacing:"0.5px"}}>
                    {nft?.metadata?.extra?.materialMediumUsed}
                </div>
            </div>}
            <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
            {nft?.metadata?.extra?.custom?.map(item => {
                return <>
                    <div style={{marginTop:13}}>
                        <div style={{fontSize:14, opacity:0.66}}>{item.name}</div>
                        {item.type === 1 ?
                        <div onClick={() => helpers.openInNewTab(item.fileUrl)} style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, cursor:"pointer", letterSpacing:"0.5px", display:"flex"}}>
                            <div style={{marginRight:10, borderBottom:"1px solid #fff", paddingBottom:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.fileUrl}</div>
                            <div><FiExternalLink size={22} color='#fff'/></div>
                        </div> :
                        <div style={{fontFamily:200, fontSize:16, opacity:0.95, marginTop:5, letterSpacing:"0.5px"}}>
                            {item?.text || item?.date}
                        </div>}
                    </div>
                    <div style={{height:1, width:"100%", backgroundColor:"#fff", opacity:0.16, marginTop:7}}/>
                </>
            })} */}
      </>
    );
  };

  const showHistory = () => {
    return (
      <>
        <div className="space-y-4 w-full pt-5 bg-transparent flex flex-col justify-center items-start">
          {bids &&
            bids.length > 0 &&
            bids.map((bid) => (
              <div className="w-full border-b pb-2 flex flex-row justify-around items-center">
                <div className="w-full md:w-1/2 space-y-2 flex flex-col justify-center items-start">
                  <h1 className="text-lg">
                    Bid placed by{" "}
                    <span className="font-bold">
                      {bid.bidder.substring(0, 8)}...
                    </span>{" "}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {new Date(bid.timestamp * 1000).toString()}
                  </p>
                </div>
                <div className="w-1/2 md:space-y-2 flex flex-col justify-center items-end">
                  <h1 className="text-lg font-bold">
                    {ethers.utils.formatEther(bid.amount)} MATIC
                  </h1>
                </div>
                <div className="w-1/2 flex flex-col justify-center items-end">
                  {saleData &&
                    saleData.auction &&
                    saleData.auction.highestBidder &&
                    bid.bidder.toLowerCase() ==
                      saleData.auction.highestBidder.toLowerCase() && (
                      <div>
                        <GradientBtn
                          style={{
                            marginTop: 30,
                            marginRight: 20,
                            cursor: purchasable ? "pointer" : "no-drop",
                            opacity: purchasable ? 1 : 0.6,
                          }}
                          content={<div>Highest Bidder</div>}
                        />
                      </div>
                    )}
                  {saleData &&
                    saleData.auction &&
                    saleData.auction.highestBidder &&
                    bid.bidder.toLowerCase() !==
                      saleData.auction.highestBidder.toLowerCase() && (
                      <div>
                        <GradientBtn
                          style={{
                            marginTop: 30,
                            marginRight: 20,
                            cursor: purchasable ? "pointer" : "no-drop",
                            opacity: purchasable ? 1 : 0.6,
                          }}
                          content={<div>Refunded</div>}
                        />
                      </div>
                    )}
                </div>
              </div>
            ))}
          {bids.length === 0 && (
            <h1 className="text-xl font-bold">No Bids Found</h1>
          )}
        </div>
      </>
    );
  };

  const renderNfts = () => {
    return moreNfts.slice(0, 4).map((nft) => {
      var number;
      var id;
      try {
        number = ethers.utils.formatEther(nft.salePrice.toString());
        id = nft.nft.tokenId.toString();
      } catch (e) {
        // console.log(e);
      }
      return (
        <Col
          key={uuid()}
          style={{ marginBottom: 25 }}
          lg={3}
          md={4}
          sm={6}
          xs={12}
        >
          <NftCard
            onClick={() => {
              const link = nft?.nft.erc721
                ? `/polygon/nftdetails/${
                    nft.nft.nftAddress
                  }/${nft.nft.tokenId.toString()}`
                : `/polygon/${nft.nft.owner}/${
                    nft.nft.nftAddress
                  }/${nft.nft.tokenId.toString()}`;
              const a = document.createElement("a");
              a.setAttribute(
                "href",
                link
              );
              a.click();
            }}
            image={
              nft.nft.tokenUri.startsWith("ipfs")
                ? `https://${nft.nft.tokenUri.substring(
                    7
                  )}.ipfs.nftstorage.link`
                : nft.tokenUri
            }
            title={nft.nft.title}
            nearFee={number}
            artistName={nft?.nft.artistName?.substring(0, 8) + "..."}
            artistImage={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            }
            near={false}
          />
        </Col>
      );
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className={classes.container}>
      <div className={classes.detailsGradientOverlay} />
      <div className={classes.detailsGradientOverlayPink} />
      {nft && (
        <Row
          className={isModalOpen || isSaleModalOpen ? "filter blur-2xl " : ""}
        >
          <Col lg={7} md={7}>
            <div style={{ textAlign: "center" }}>
              {nft?.isVideo ? (
                <div id="tv_container">
                  <video
                    className={classes.nftImage}
                    controls
                    autoPlay
                    muted
                  >
                    <source
                      src={
                        nft.tokenUri.startsWith("ipfs")
                          ? `https://${nft.tokenUri.substring(
                              7
                            )}.ipfs.nftstorage.link`
                          : nft.tokenUri
                      }
                    />
                    nft
                  </video>
                </div>
              ) : (
                <img
                  className={classes.nftImage}
                  src={
                    nft.tokenUri.startsWith("ipfs")
                      ? `https://${nft.tokenUri.substring(
                          7
                        )}.ipfs.nftstorage.link`
                      : nft.tokenUri
                  }
                  alt="nft"
                />
              )}
            </div>
          </Col>
          <Col className={classes.descriptionCol} lg={5} md={5}>
            <div style={globalStyles.flexRowSpace}>
              <div
                style={{
                  marginRight: 10,
                }}
                className="space-y-2"
              >
                <h1
                  style={{
                    fontFamily: "Athelas-Bold",
                    fontSize: 36,
                    textTransform: "capitalize",
                    lineHeight: "40px",
                  }}
                >
                  {nft?.title}
                </h1>
                {saleData && saleData.salePrice && (
                  <div className="font-inter flex items-center">
                    <span className="text-gray-400">Price:</span>{" "}
                    <span className="ml-2 font-bold">
                      {ethers.utils.formatEther(saleData?.salePrice)}
                    </span>
                    <img src={polygon} className="ml-2 w-5 h-5" />
                  </div>
                )}
              </div>
              <div style={{ display: "flex" }}>
                <span
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 100,
                    padding: 6,
                    opacity: 0.6,
                    cursor: "pointer",
                  }}
                  onClick={() => updateSavedNFT()}
                >
                  {savedNft ? (
                    <BsFillBookmarkFill size={22} color="#130F26" />
                  ) : (
                    <FiBookmark size={22} color="#130F26" />
                  )}
                </span>
                <span
                  style={{
                    backgroundColor: "#fff",
                    marginLeft: 15,
                    borderRadius: 100,
                    padding: 6,
                    opacity: 0.6,
                    cursor: "no-drop",
                  }}
                >
                  <FiMoreVertical size={22} color="#130F26" />
                </span>
              </div>
            </div>
            {/* <WhatsappShareButton
                        title={nft?.metadata?.title}
                        separator={"/%0A"}
                        style={{height:50, width:50, background:"#fff", color:'red'}} 
                        url={window.location.href}
                    >
                        whatsapp
                    </WhatsappShareButton> */}
            {purchasable.owner && purchasable.auctionEnded && nft?.price && (
              <div style={{ marginTop: 5 }}>
                <span style={{ fontSize: 15, opacity: 0.6 }}>Price:</span>
                <span style={{ marginLeft: 5, fontSize: 17 }}>
                  {nft?.price} ETH
                </span>
              </div>
            )}
            <div>
              <div style={{ ...globalStyles.flexRow, marginTop: 20 }}>
                <div
                  onClick={() => setIsOverviewActive(1)}
                  style={{
                    fontWeight: isOverviewActive !== 1 ? "400" : "bold",
                    opacity: isOverviewActive !== 1 ? 0.7 : 1,
                    fontSize: 12,
                    cursor: "pointer",
                    letterSpacing: 1.5,
                  }}
                >
                  OVERVIEW
                </div>
                <div
                  onClick={() => setIsOverviewActive(2)}
                  style={{
                    fontWeight: isOverviewActive !== 2 ? "400" : "bold",
                    opacity: isOverviewActive !== 2 ? 0.7 : 1,
                    fontSize: 12,
                    marginLeft: 30,
                    cursor: "pointer",
                    letterSpacing: 1.5,
                  }}
                >
                  OTHER DETAILS
                </div>
                <div
                  onClick={() => setIsOverviewActive(3)}
                  style={{
                    fontWeight: isOverviewActive !== 3 ? "400" : "bold",
                    opacity: isOverviewActive !== 3 ? 0.7 : 1,
                    fontSize: 12,
                    marginLeft: 30,
                    cursor: "pointer",
                    letterSpacing: 1.5,
                  }}
                >
                  HISTORY
                </div>
              </div>
              <motion.div
                animate={{
                  x:
                    isOverviewActive === 1
                      ? 33
                      : isOverviewActive === 2
                      ? 150
                      : 270,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  height: 3,
                  background: "#fff",
                  width: 8,
                  borderRadius: 100,
                  marginTop: 2,
                }}
              />
            </div>
            {isOverviewActive === 1
              ? overview()
              : isOverviewActive === 2
              ? otherDetails()
              : showHistory()}
            {purchasable.owner && (
              <div className={classes.ownedBtnResponsive}>
                <img style={{ height: 30 }} src={party} alt="party" />
                &nbsp;&nbsp; This nft is now yours!
              </div>
            )}
            {nft?.erc721 && (
              <>
                {purchasable.owner &&
                  !purchasable.auctionEnded &&
                  saleData &&
                  saleData.auction && (
                    <div>
                      <GradientBtn
                        style={{
                          marginTop: 30,
                          cursor: purchasable ? "pointer" : "no-drop",
                          opacity: purchasable ? 1 : 0.6,
                        }}
                        onClick={() => endAuction(params.address, params.id)}
                        content={<div>END AUCTION</div>}
                      />
                    </div>
                  )}
                {purchasable.owner &&
                  purchasable.auctionEnded &&
                  saleData &&
                  saleData.auction && (
                    <div>
                      <GradientBtn
                        style={{
                          marginTop: 30,
                          cursor: purchasable ? "pointer" : "no-drop",
                          opacity: purchasable ? 1 : 0.6,
                        }}
                        onClick={() => endAuction(params.address, params.id)}
                        content={<div>END AUCTION</div>}
                      />
                    </div>
                  )}
                {!purchasable.owner &&
                  purchasable.auctionEnded &&
                  saleData &&
                  saleData.auction &&
                  saleData.auction.highestBidder &&
                  saleData.auction.highestBidder.toLowerCase() ===
                    evmWalletData.address.toLowerCase() && (
                    <div>
                      <GradientBtn
                        style={{
                          marginTop: 30,
                          cursor: purchasable ? "pointer" : "no-drop",
                          opacity: purchasable ? 1 : 0.6,
                        }}
                        onClick={() => endAuction()}
                        content={<div>CLAIM NFT</div>}
                      />
                    </div>
                  )}
                {!purchasable.owner &&
                  !purchasable.auctionEnded &&
                  saleData &&
                  saleData.isOnSale &&
                  ((saleData.auction && saleData.auction.highestBidder
                    ? saleData.auction.highestBidder.toLowerCase() !==
                      evmWalletData.address.toLowerCase()
                    : saleData.saleType == "1") ||
                    saleData.saleType === "0") && (
                    <div>
                      <GradientBtn
                        style={{
                          marginTop: 30,
                          cursor: purchasable ? "pointer" : "no-drop",
                          opacity: purchasable ? 1 : 0.6,
                        }}
                        onClick={() =>
                          purchasable && nft?.salePrice
                            ? setIsModalOpen(true)
                            : null
                        }
                        content={
                          <div
                            onClick={() =>
                              !purchasable.owner && price > 0
                                ? setIsModalOpen(true)
                                : setIsModalOpen(false)
                            }
                          >
                            PURCHASE FOR{" "}
                            {saleData.auction && saleData.auction.highestBid
                              ? ethers.utils.formatEther(
                                  saleData.auction.highestBid
                                )
                              : ethers.utils.formatEther(price.toString())}{" "}
                            MATIC
                          </div>
                        }
                      />
                    </div>
                  )}
                {!purchasable.owner &&
                  !purchasable.auctionEnded &&
                  saleData &&
                  saleData.auction &&
                  saleData.auction.highestBidder &&
                  saleData.auction.highestBidder.toLowerCase() ==
                    evmWalletData.address.toLowerCase() && (
                    <div>
                      <GradientBtn
                        style={{
                          marginTop: 30,
                          cursor: purchasable ? "pointer" : "no-drop",
                          opacity: purchasable ? 1 : 0.6,
                        }}
                        content={<div>HIGHEST BIDDER</div>}
                      />
                    </div>
                  )}
                {purchasable.owner &&
                  saleData &&
                  (saleData.saleType === "0" || saleData.saleType === 0) && (
                    <div>
                      <GradientBtn
                        style={{
                          marginTop: 30,
                          cursor: purchasable ? "pointer" : "no-drop",
                          opacity: purchasable ? 1 : 0.6,
                        }}
                        onClick={() => {
                          cancelSales();
                        }}
                        content={<div>CANCEL LISTING</div>}
                      />
                    </div>
                  )}
              </>
            )}
            {saleData && !saleData.isOnSale && (
              <div>
                <GradientBtn
                  style={{
                    marginTop: 30,
                    cursor: purchasable ? "pointer" : "no-drop",
                    opacity: purchasable ? 1 : 0.6,
                  }}
                  content={<div>UNAVAILABLE</div>}
                />
              </div>
            )}
            {purchasable.owner && purchasable.auctionEnded && price <= 0 && (
              <GradientBtn
                style={{
                  marginTop: 30,
                  cursor: purchasable ? "pointer" : "no-drop",
                  opacity: purchasable ? 1 : 0.6,
                }}
                onClick={() => setIsSaleModalOpen(true)}
                content={<div>WANT TO LIST THIS NFT?</div>}
              />
            )}
            <div>
              <GradientBtn
                style={{
                  marginTop: 30,
                  cursor: purchasable ? "pointer" : "no-drop",
                  opacity: purchasable ? 1 : 0.6,
                }}
                onClick={() => buyMatic()}
                content={<div>PURCHASE WITH INR</div>}
              />
            </div>
          </Col>
        </Row>
      )}
      <div
        className={
          (isModalOpen || isSaleModalOpen ? "filter blur-2xl " : "") +
          classes.bottomContent
        }
      >
        <div className={classes.heading}>More NFTs like this</div>
        <Row>{renderNfts()}</Row>
      </div>
      <Modal show={show} onHide={() => setShow(false)} />
      {isModalOpen && (
        <BuyNFTModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          saleData={saleData}
          nft={nft}
          price={price}
          erc721={collection?.erc721}
        />
      )}
      {isSaleModalOpen && (
        <SaleNFTModal
          isOpen={isSaleModalOpen}
          setIsOpen={setIsSaleModalOpen}
          nft={nft}
          erc721={collection?.erc721}
        />
      )}
      <div
        id="widget"
        className={
          (fiat ? "" : "hidden ") +
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        }
      >
        {fiat && (
          <div
            onClick={() => setFiat(false)}
            style={{
              cursor: "pointer",
              zIndex: "10000",
            }}
          >
            <FiX className="text-2xl text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
