import { motion } from "framer-motion";
import React, { Component, Fragment, useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { FiFacebook, FiGlobe } from "react-icons/fi";
import { BsInstagram } from "react-icons/bs";
import { useHistory, useLocation, useParams } from "react-router-dom";

import profileSvg from "../../assets/svgs/profile-icon-big.svg";
import NftCard from "../../components/explore/NftCard";
import globalStyles from "../../globalStyles";
import classes from "./profile.module.css";
import { connect, useSelector } from "react-redux";
import {
  _getAllArtists,
  _getNftArtists,
  _getOneArtist,
} from "../../services/axios/api";
import NearHelperFunctions from "../../services/nearHelperFunctions";
import Spinner from "../../components/uiComponents/Spinner";
import uuid from "react-uuid";
import { staticValues } from "../../constants";
import { useNFTs } from "../../hooks";
import { useAppContext } from "../../context/wallet";
import { GradientBtn, OutlineBtn } from "../../components/uiComponents/Buttons";
import useCollection from "../../hooks/useCollection";
import { useSavedNFTs } from "../../hooks/useSavedNFTs";
import { ethers } from "ethers";
import { CollectionCard } from "../../components/explore/CollectionCard";

const mainText = {
  minted: "Create NFT and mint it now to get forever royalties",
  collections: "Create Collection and start minting NFTs",
  owned: "Buy some NFTs",
  saved: "Save some NFTs",
};

const btnText = {
  minted: "Mint NFTs",
  collections: "Create Collection",
  owned: "EXPLORE MARKETPLACE",
  saved: "EXPLORE MARKETPLACE",
};

export default function UserProfile(props) {
  const { getUserCollectionsAndAssets, getUserCollections } = useCollection();
  const { getMintedNFTs, getOwnedNFTs: getEVMOwnedNFTs } = useNFTs();
  const walletInfo = useSelector((state) => state.nearReducer.walletInfo);
  const isWalletSignedIn = useSelector(
    (state) => state.nearReducer.isWalletSignedIn
  );
  const userData = useSelector((state) => state.nearReducer.userData);
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const accountId = location?.state?.ownerAccountId
    ? location?.state?.ownerAccountId
    : walletInfo && walletInfo.getAccountId();

  const { getManyNFTs } = useNFTs();
  const { contract, evmWalletData, evmWallet, evmProvider } = useAppContext();
  const [totalEVMNfts, setTotalEVMNfts] = useState(true);
  const [allEVMNfts, setAllEVMNfts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState("");
  const [mintedNfts, setMintedNfts] = useState([])
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [savedNfts, setSavedNfts] = useState([]);
  const [noUserFound, setNoUserFound] = useState(false);
  const [activeTab, setActiveTab] = useState("minted");
  const [userCollections, setUserCollections] = useState([]);
  const [savedNFTs, setSavedNFTs] = useState([]);

  useEffect(() => {
    if (walletInfo) {
      getArtist(false);
    } else if (evmWalletData) {
      getArtist(true);
    }
  }, [walletInfo, evmWalletData]);

  useEffect(() => {
    if (evmWalletData) {
      _getNftArtists({
        artist: ethers.utils.getAddress(evmWalletData.address),
        owner: ethers.utils.getAddress(evmWalletData.address),
      }).then(({ data: { artist, owner } }) => {
        const savedNft = artist?.savedNft;
        console.log(savedNft, "Dsa");
        const queryData = savedNft.map((nft) => `${nft.address}-${nft.token}`);
        console.log(queryData, "dasdsdsa");
        getManyNFTs(queryData).then((res) => {
          console.log(res, "daswerwr");
          setSavedNFTs(res);
        });
      });
    }
  }, [evmWalletData]);

  useEffect(() => {
    fetchEVMNft();
  }, [contract]);

  useEffect(() => {
    if (evmProvider) {
      getUserCollections(evmWalletData.address)
        .then((res) => setUserCollections(res))
        .catch((e) => console.error(e));
      getMintedNFTs(evmWalletData.address)
        .then((res) => setMintedNfts(res))
        .catch((e) => console.error(e));
      getEVMOwnedNFTs(evmWalletData.address)
        .then((res) => setOwnedNfts(res))
        .catch((e) => console.error(e));
    }
  }, [evmProvider]);

  const getOwnedNfts = () => {
    const functions = new NearHelperFunctions(walletInfo);
    functions
      .getOwnedNfts(accountId)
      .then((res) => {
        setOwnedNfts(res);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        alert("something went wrong!");
        setLoading(false);
      });
  };

  const getArtist = (evm = false) => {
    _getAllArtists({
      wallet: evm ? evmWalletData.address : accountId,
      sortBy: "createdAt",
      sort: -1,
    })
      .then(({ data }) => {
        setArtist(data.artists[0]);
        if (!evm) getOwnedNfts();
      })
      .catch((err) => {
        if (
          err.response.data.error ==
          "wallet with value accountId fails to match the NEAR testnet pattern"
        ) {
          setNoUserFound(true);
        }
        setLoading(false);
      });
  };

  const profileInfo = () => {
    return (
      <div className={classes.profileContainer}>
        <img
          style={{
            height: 100,
            width: 100,
            borderRadius: 100,
            objectFit: "cover",
            marginTop: 30,
          }}
          src={artist?.image ?? profileSvg}
          alt="profile"
        />
        <div
          style={{ fontFamily: "Athelas-bold", fontSize: 24, marginTop: 10 }}
        >
          {artist?.name}
        </div>
        <div
          style={{
            opacity: 0.7,
            fontSize: 13,
            color: "#fff",
            letterSpacing: 1,
            marginTop: 4,
            wordBreak: "break-word",
            padding: "0 30px",
          }}
        >
          {artist?.wallet}
        </div>
        <div
          style={{
            opacity: 0.9,
            fontSize: 15,
            color: "#fff",
            letterSpacing: 1,
            marginTop: 17,
          }}
        >
          {artist?.description}
        </div>
        {/* <div style={{...globalStyles.flexRow, justifyContent:"center", marginTop:25}}>
                <div className={classes.iconContainer}>
                    <BsInstagram color='#000' size={16}/>
                </div>
                <div style={{marginLeft:15}} className={classes.iconContainer}>
                    <FiFacebook color='#000' size={16}/>
                </div>
                <div style={{marginLeft:15}} className={classes.iconContainer}>
                    <FiGlobe color='#000' size={16}/>
                </div>
            </div> */}
        {/* location?.state?.ownerAccountId */}
        {walletInfo?.getAccountId() === location?.state?.ownerAccountId && (
          <div
            onClick={() => history.push("/editprofile")}
            className={classes.editBtn}
          >
            EDIT PROFILE
          </div>
        )}
      </div>
    );
  };

  const harmonyProfileInfo = () => {
    return (
      <div className={classes.profileContainer}>
        <img
          style={{
            height: 100,
            width: 100,
            borderRadius: 100,
            objectFit: "cover",
            marginTop: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
          src={artist ? artist.image : profileSvg}
          alt="profile"
        />
        <div
          style={{ fontFamily: "Athelas-bold", fontSize: 24, marginTop: 10 }}
        >
          {evmWalletData.address.substring(0, 5)}...
        </div>
        <div
          style={{
            opacity: 0.7,
            fontSize: 13,
            color: "#fff",
            letterSpacing: 1,
            marginTop: 4,
            wordBreak: "break-word",
            padding: "0 30px",
          }}
        >
          {evmWalletData.address}
        </div>
        <div
          style={{
            opacity: 0.9,
            fontSize: 15,
            color: "#fff",
            letterSpacing: 1,
            marginTop: 17,
          }}
        >
          Testing
        </div>
        {/* <div style={{...globalStyles.flexRow, justifyContent:"center", marginTop:25}}>
                <div className={classes.iconContainer}>
                    <BsInstagram color='#000' size={16}/>
                </div>
                <div style={{marginLeft:15}} className={classes.iconContainer}>
                    <FiFacebook color='#000' size={16}/>
                </div>
                <div style={{marginLeft:15}} className={classes.iconContainer}>
                    <FiGlobe color='#000' size={16}/>
                </div>
            </div> */}
        {/* location?.state?.ownerAccountId */}
        {evmWalletData?.address === params.address && (
          <div
            onClick={() => history.push("/editprofile")}
            className={classes.editBtn}
          >
            EDIT PROFILES
          </div>
        )}
      </div>
    );
  };

  const fetchEVMNft = async () => {
    try {
      setLoading(true);
      // const nfts = await getNFTsOnSale();
      // console.log(nfts, "nfts")
      // setAllEVMNfts(nfts);
      // setTotalEVMNfts(nfts.length);
      setLoading(false);
    } catch (e) {
      // console.log(e);
      // alert("something went wrong!");
      setLoading(false);
    }
  };

  const renderNfts = () => {
    return ownedNfts.map((nft) => {
      return (
        <Col
          key={uuid()}
          style={{ marginBottom: 25 }}
          lg={4}
          md={6}
          sm={6}
          xs={12}
        >
          <NftCard
            onClick={() => history.push(`/nftdetails/${nft.token_id}`)}
            image={nft.metadata.media}
            title={nft.metadata.title}
            nearFee={nft.price}
            price={"$121,000,000"}
            artistName={nft?.artist?.name}
            artistImage={nft?.artist?.image}
          />
        </Col>
      );
    });
  };

  const renderEVMNfts = () => {
    return (
      allEVMNfts &&
      allEVMNfts.map((nft) => {
        var number;
        var id;
        try {
          number = nft.saleprice.toString();
          id = nft.tokenId.toString();
        } catch (e) {
          // console.log(e);
        }
        const url = `/polygon/nftdetails/${id}`;
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
              onClick={() => history.push(url)}
              image={nft.tokenUri}
              title={nft.title}
              nearFee={number}
              artistName={nft?.artistName.substring(0, 15)}
              artistImage={nft?.tokenUri}
            />
          </Col>
        );
      })
    );
  };

  const emptyState = () => {
    return (
      <div
        style={{
          ...globalStyles.flexRow,
          flexDirection: "column",
          marginTop: 50,
          marginBottom: 30,
        }}
      >
        <div style={{ fontSize: 16, opacity: 0.7 }}>
          Buy NFTs to create a collection here!
        </div>
        <div
          onClick={() => history.push("/browse")}
          className="glow-on-hover"
          type="button"
          style={{ zIndex: 100 }}
        >
          <div className={classes.glowBtnText} style={{ marginLeft: 1 }}>
            EXPLORE MARKETPLACE
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Spinner />;

  if (noUserFound && !evmWalletData)
    return (
      <div style={{ textAlign: "center", fontSize: 24, marginTop: 160 }}>
        No user found!
      </div>
    );

  return (
    <div>
      {!noUserFound && isWalletSignedIn && (
        <>
          {artist.coverStatus === 0 ? (
            <div
              style={{ background: artist.coverGradient }}
              className={classes.profileCover}
            />
          ) : (
            <img
              className={classes.profileCover}
              src={artist.coverImage}
              alt="cover"
            />
          )}
          <Container fluid className={classes.container}>
            <Row>
              <Col
                style={{ display: "flex", justifyContent: "center" }}
                lg={4}
                md={4}
                sm={12}
              >
                {profileInfo()}
              </Col>
              <Col lg={8} md={8}>
                <div style={{ margin: "30px auto", width: "100%" }}>
                  <div
                    style={{
                      ...globalStyles.flexRow,
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          letterSpacing: 1.5,
                        }}
                      >
                        NFTS OWNED
                      </div>
                      {/* <div style={{height:3, background:"#fff", width:8, borderRadius:100, margin:"2.5px auto"}}/> */}
                    </div>
                    {/* <div onClick={() => this.setState({activeTab:"saved"})} style={{fontWeight: activeTab == "saved" ? "bold" : "400", opacity: activeTab == "saved" ? 1 : 0.7, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                            SAVED
                                        </div>
                                        <div onClick={() => this.setState({activeTab:"sold"})} style={{fontWeight: activeTab == "sold" ? "bold" : "400", opacity: activeTab == "sold" ? 1 : 0.7, fontSize:12, marginLeft:30, cursor:'pointer', letterSpacing:1.5}}>
                                            SOLD
                                        </div> */}
                  </div>
                  {/* bottom indicator */}
                  {/* <motion.div 
                                        animate={{ 
                                            x: 430
                                        }}
                                        transition={{ duration: 0.5 }}
                                        style={{height:3, background:"#fff", width:8, borderRadius:100, marginTop:2}}
                                    />  */}
                </div>
                <Row>
                  {ownedNfts.length !== 0 ? <>{renderNfts()}</> : emptyState()}
                </Row>
              </Col>
            </Row>
          </Container>
        </>
      )}
      {evmWalletData && (
        <div className="w-full space-y-10 min-h-screen md:mt-[105px] sm:mt-0">
          {/* <div className="w-full h-96" style={!collection.cover.isGradient ? { backgroundImage:`url("${collection.cover.uri}")`} : { background: collection.cover.uri }}></div> */}
          <div
            className="w-full h-96"
            style={{
              background:
                artist.coverStatus === 0
                  ? artist.coverGradient
                  : `url("${artist.coverImage}")`,
            }}
          ></div>
          <div className="w-full h-full flex flex-col md:flex-row justify-start items-start">
            <div className="-mt-40 w-full md:w-1/4 h-full mx-20 bg-black/75 backdrop-blur-lg rounded-xl p-10 flex flex-col justify-start items-center space-y-5">
              <img
                src={artist ? artist.image : profileSvg}
                className="rounded-full bg-white w-40 h-40"
              />
              <h1 className="font-bold text-3xl">
                {artist
                  ? artist.name.substring(0, 15)
                  : evmWalletData.address.substring(0, 6) + "..."}
              </h1>
              <p className="text-gray-400">{artist && artist.description}</p>
              <div className="w-full flex justify-center items-center space-x-5">
                {/* <img src={facebook} className="w-10 h-10 bg-white rounded-full p-2" />
                                <img src={instagram} className="w-10 h-10 bg-white rounded-full p-2" />
                                <img src={website} className="w-10 h-10 bg-white rounded-full p-2" /> */}
              </div>
              <div className="w-full h-full flex flex-col justify-start items-center mt-10 pt-10 space-y-8">
                <div className="w-1/2 flex justify-end items-center space-x-4">
                  <OutlineBtn
                    onClick={() => history.push("/editprofile")}
                    text="EDIT PROFILE"
                    style={{ width: "187px", color: "#fff" }}
                  />
                </div>
              </div>
            </div>
            <div className="w-3/4 h-full space-y-5">
              <div className="w-full flex justify-center items-center space-x-4">
                <h3
                  className={
                    (activeTab === "minted"
                      ? "border-b-2 border-b-white border-"
                      : "") + " cursor-pointer text-lg font-bold"
                  }
                  onClick={() => setActiveTab("minted")}
                >
                  Minted
                </h3>
                <h3
                  className={
                    (activeTab === "collections"
                      ? "border-b-2 border-b-white border-"
                      : "") + " cursor-pointer text-lg font-bold"
                  }
                  onClick={() => setActiveTab("collections")}
                >
                  Collections
                </h3>
                <h3
                  className={
                    (activeTab === "owned"
                      ? "border-b-2 border-b-white border-"
                      : "") + " cursor-pointer text-lg font-bold"
                  }
                  onClick={() => setActiveTab("owned")}
                >
                  Owned
                </h3>
                <h3
                  className={
                    (activeTab === "saved"
                      ? "border-b-2 border-b-white border-"
                      : "") + " cursor-pointer text-lg font-bold"
                  }
                  onClick={() => setActiveTab("saved")}
                >
                  Saved
                </h3>
              </div>
              {activeTab === "minted" && (
                <>
                  {mintedNfts.length <= 0 ? (
                    <div className="w-full h-80 flex flex-col justify-center items-center space-y-5">
                      <h1 className="font-bold text-xl">
                        {mainText[activeTab]}
                      </h1>
                      <div
                        onClick={() => history.push(`/create/nft`)}
                        className="w-1/2 flex justify-center items-center"
                      >
                        <GradientBtn
                          content={btnText[activeTab]}
                          style={{ width: "187px", color: "#fff" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Row>
                      {mintedNfts.map((nft) => (
                        <Col
                          key={uuid()}
                          style={{ marginBottom: 25 }}
                          lg={3}
                          md={4}
                          sm={6}
                          xs={12}
                        >
                          <NftCard
                            onClick={() =>
                              history.push(
                                `/polygon/nftdetails/${nft.nftAddress}/${nft.tokenId}`
                              )
                            }
                            image={
                              nft.tokenUri.startsWith("ipfs")
                                ? `https://${nft.tokenUri.substring(
                                    7
                                  )}.ipfs.nftstorage.link`
                                : nft.tokenUri
                            }
                            title={nft.title}
                            nearFee={
                              nft.saleData && nft.saleData?.salePrice
                                ? ethers.utils
                                    .formatEther(nft.saleData.salePrice)
                                    .toString()
                                : 0
                            }
                            artistName={artist.name.substring(0, 15)}
                            artistImage={artist.image}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              )}
              {activeTab == "collections" && (
                <>
                  {userCollections.length > 0 ? (
                    <Row>
                      {userCollections.map((collection) => (
                        <Col
                          key={uuid()}
                          style={{ marginBottom: 25 }}
                          lg={3}
                          md={4}
                          sm={6}
                          xs={12}
                        >
                          <CollectionCard
                            onClick={() =>
                              history.push(`/collection/${collection.id}`)
                            }
                            image={
                              collection.logo.startsWith("ipfs")
                                ? `https://${collection.logo.substring(
                                    7
                                  )}.ipfs.nftstorage.link`
                                : collection.logo
                            }
                            title={collection.name}
                            artistName={collection.artistName.substring(0, 15)}
                            artistImg={collection.artistImg}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="w-full h-80 flex flex-col justify-center items-center space-y-5">
                      <h1 className="font-bold text-xl">
                        {mainText[activeTab]}
                      </h1>
                      <div
                        onClick={() => history.push(`/create/collection`)}
                        className="w-1/2 flex justify-center items-center"
                      >
                        <GradientBtn
                          content={btnText[activeTab]}
                          style={{ width: "187px", color: "#fff" }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeTab === "owned" && (
                <>
                  {ownedNfts.length > 0 ? (
                    <Row>
                      {ownedNfts.map((nft) => (
                        <Col
                          key={uuid()}
                          style={{ marginBottom: 25 }}
                          lg={3}
                          md={4}
                          sm={6}
                          xs={12}
                        >
                          <NftCard
                            onClick={() =>
                              history.push(
                                `/polygon/nftdetails/${nft.nftAddress}/${nft.tokenId}`
                              )
                            }
                            image={
                              nft.tokenUri.startsWith("ipfs")
                                ? `https://${nft.tokenUri.substring(
                                    7
                                  )}.ipfs.nftstorage.link`
                                : nft.tokenUri
                            }
                            title={nft.title}
                            nearFee={
                              nft.saleData && nft.saleData?.salePrice
                                ? ethers.utils
                                    .formatEther(nft.saleData.salePrice)
                                    .toString()
                                : 0
                            }
                            artistName={nft.artistName?.substring(0, 8)}
                            artistImage={nft.artistImg}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="w-full h-80 flex flex-col justify-center items-center space-y-5">
                      <h1 className="font-bold text-xl">
                        {mainText[activeTab]}
                      </h1>
                      <div
                        onClick={() => history.push(`/browse`)}
                        className="w-1/2 flex justify-center items-center"
                      >
                        <GradientBtn
                          content={btnText[activeTab]}
                          style={{ width: "187px", color: "#fff" }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeTab === "saved" && (
                <>
                  {savedNFTs.length > 0 ? (
                    <Row>
                      {savedNFTs.map((nft) => (
                        <Col
                          key={uuid()}
                          style={{ marginBottom: 25 }}
                          lg={3}
                          md={4}
                          sm={6}
                          xs={12}
                        >
                          <NftCard
                            onClick={() =>
                              history.push(
                                `/polygon/nftdetails/${nft.nftAddress}/${nft.tokenId}`
                              )
                            }
                            image={
                              nft.tokenUri.startsWith("ipfs")
                                ? `https://${nft.tokenUri.substring(
                                    7
                                  )}.ipfs.nftstorage.link`
                                : nft.tokenUri
                            }
                            title={nft.title}
                            nearFee={"0"}
                            artistName={nft.artistName.substring(0, 8) + "..."}
                            artistImage={nft.artistImg}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="w-full h-80 flex flex-col justify-center items-center space-y-5">
                      <h1 className="font-bold text-xl">
                        {mainText[activeTab]}
                      </h1>
                      <div
                        onClick={() => history.push(`/browse`)}
                        className="w-1/2 flex justify-center items-center"
                      >
                        <GradientBtn
                          content={btnText[activeTab]}
                          style={{ width: "187px", color: "#fff" }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* {activeTab !== 'minted' && 
                                <div className="w-full h-80 flex flex-col justify-center items-center space-y-5">
                                    <h1 className='font-bold text-xl'>
                                        {mainText[activeTab]}
                                    </h1>
                                    <div className="w-1/2 flex justify-center items-center">
                                        <GradientBtn
                                            content={
                                                btnText[activeTab]
                                            }
                                            style={{ width: "187px", color: "#fff" }}
                                        />
                                    </div>
                                </div>
                            } */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
