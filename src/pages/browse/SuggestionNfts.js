import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import uuid from "react-uuid";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import ArtistCard from "../../components/explore/ArtistCard";
import Tabs from "../../components/uiComponents/Tabs";
import classes from "./browse.module.css";
import nearLogo from "../../assets/svgs/near-logo.svg";
import polygonLogo from "../../assets/svgs/polygon-logo.svg";
import globalStyles from "../../globalStyles";
import { ethers } from "ethers";
import { Col } from "react-bootstrap";
import { default as NFT } from "../../components/explore/NftCard";
import { CollectionCard } from "../../components/explore/CollectionCard"; 

const arrowStyle = {
  top: "130px",
  right: 20,
  position: "absolute",
  zIndex: 1,
  background: "rgba(0, 5, 19, 0.7)",
  padding: "10px",
  borderRadius: "30px",
  width: "45px",
  cursor: "pointer",
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

function NextArrow({ onClick }) {
  return (
    <div style={arrowStyle} onClick={onClick}>
      <FiChevronRight color="#fff" size={25} />
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div style={{ ...arrowStyle, left: 20 }} onClick={onClick}>
      <FiChevronLeft color="#fff" size={25} />
    </div>
  );
}

function SuggestionNfts({
  topCollections,
  recentlyEVMAdded,
  recentlyAdded,
  trendingNfts,
  trendingArtists,
  evmTrendingNfts,
  nearWallet,
}) {
  // console.log(recentlyEVMAdded, "DSAdsa");
  const tabContents = [
    { tabName: "RECENTLY ADDED", x: 100 }, // x is a hard coded value for animating bottom bar
    { tabName: "TRENDING NFTS", x: 240 },
    { tabName: nearWallet ? "TOP-SELLING ARTISTS" : "TOP COLLECTIONS", x: 400 },
  ];
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(tabContents[0]);

  useEffect(() => {
    // console.log(trendingNfts, "evm");
  }, [evmTrendingNfts]);

  function NftCard(props) {
    const {
      image,
      title,
      nearFee,
      price,
      artistName,
      artistImage,
      onClick,
      near,
    } = props;

    return (
      <div
        style={{ zIndex: 2, height: 300 }}
        onClick={onClick}
        className={classes.cardContainer}
      >
        <img src={image} alt="nft" />
        <div className={classes.cardTag}>
          <div style={globalStyles.flexRowSpace}>
            <div
              style={{
                fontFamily: "Athelas-Bold",
                fontSize: 14,
                textTransform: "capitalize",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="flex justify-center items-center space-x-1"
            >
              <span>{nearFee}</span>{" "}
              {near ? (
                <img src={nearLogo} alt="nearlogo" />
              ) : (
                <img src={polygonLogo} className="w-5 h-5" alt="nearlogo" />
              )}
            </div>
          </div>
          <div style={{ ...globalStyles.flexRowSpace, marginTop: 5 }}>
            <div style={globalStyles.flexRowSpace}>
              <img
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  objectFit: "cover",
                }}
                src={artistImage}
                alt="artist"
              />
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.67,
                  marginLeft: 5,
                  textTransform: "capitalize",
                  color: "#fff",
                }}
              >
                {artistName.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Contents() {
    return (
      <div style={{ marginTop: 20 }}>
        <Slider className="flex" {...settings}>
          {currentTab.tabName === "RECENTLY ADDED"
            ? nearWallet
              ? recentlyAdded.map((item) => {
                  return (
                    <div key={uuid()}>
                      <NftCard
                        onClick={() =>
                          history.push(`/nftdetails/${item?.token_id}`)
                        }
                        image={
                          item?.metadata?.extra?.nftThumbnailUrl ??
                          item?.metadata?.media
                        }
                        title={item?.metadata?.title}
                        nearFee={item?.price}
                        artistName={item?.artist?.name}
                        artistImage={item?.artist?.image}
                        near={true}
                      />
                    </div>
                  );
                })
              : recentlyEVMAdded &&
                recentlyEVMAdded.length > 0 &&
                recentlyEVMAdded.map((nft, idx) => (
                  <div key={uuid()}>
                    <NftCard
                      onClick={() =>
                        history.push(
                          nft?.nft.erc721
                            ? `/polygon/nftdetails/${
                                nft.nft.nftAddress
                              }/${nft.nft.tokenId.toString()}`
                            : `/polygon/${nft.nft.owner}/${
                                nft.nft.nftAddress
                              }/${nft.nft.tokenId.toString()}`
                        )
                      }
                      image={
                        nft.nft.tokenUri.startsWith("ipfs")
                          ? `https://${nft.nft.tokenUri.substring(
                              7
                            )}.ipfs.nftstorage.link`
                          : nft.nft.tokenUri
                      }
                      title={nft.nft.title}
                      nearFee={ethers.utils.formatEther(nft.salePrice)}
                      artistName={nft?.nft.artistName}
                      artistImage={nft?.nft.artistImg}
                      near={false}
                    />
                  </div>
                ))
            : currentTab.tabName === "TRENDING NFTS"
            ? nearWallet
              ? trendingNfts.length > 0 &&
                trendingNfts.map((item) => {
                  return (
                    <div key={uuid()}>
                      <NftCard
                        onClick={() =>
                          history.push(`/nftdetails/${item?.token_id}`)
                        }
                        image={
                          item?.metadata?.extra?.nftThumbnailUrl ??
                          item?.metadata?.media
                        }
                        title={item?.metadata?.title}
                        nearFee={item?.price}
                        artistName={item?.artist?.name}
                        artistImage={item?.artist?.image}
                      />
                    </div>
                  );
                })
              : evmTrendingNfts &&
                evmTrendingNfts.map((nft, idx) => (
                  <div key={uuid()}>
                    <NftCard
                      onClick={() =>
                        history.push(
                          nft?.nft.erc721
                            ? `/polygon/nftdetails/${
                                nft.nft.nftAddress
                              }/${nft.nft.tokenId.toString()}`
                            : `/polygon/${nft.nft.owner}/${
                                nft.nft.nftAddress
                              }/${nft.nft.tokenId.toString()}`
                        )
                      }
                      image={
                        nft?.tokenUri.startsWith("ipfs")
                          ? `https://${nft?.tokenUri?.substring(
                              7
                            )}.ipfs.nftstorage.link`
                          : nft?.tokenUri
                      }
                      title={nft?.title}
                      nearFee={ethers.utils.formatEther(nft?.salePrice)}
                      artistName={nft?.artistName}
                      artistImage={nft?.artistImg}
                    />
                  </div>
                ))
            : nearWallet
            ? trendingArtists.map((artist) => {
                return (
                  <div key={uuid()}>
                    <ArtistCard
                      styles={{ marginTop: 50, width: "95%" }}
                      onClick={() => history.push(`/ourartists/${artist._id}`)}
                      image={artist.image}
                      name={artist.name}
                      artform={artist?.artform?.name ?? "-----"}
                      place={artist.state ?? "-----"}
                    />
                  </div>
                );
              })
            : topCollections &&
              topCollections.map((collection) => {
                return (
                  <div key={uuid()} className="p-3">
                    <CollectionCard
                      onClick={() =>
                        history.push(`/collection/${collection.id}`)
                      }
                      image={
                        collection?.logo && collection.logo.startsWith("ipfs")
                          ? `https://${collection.logo.substring(
                              7
                            )}.ipfs.nftstorage.link`
                          : collection.logo
                      }
                      title={collection?.name && collection.name}
                      artistName={
                        collection?.artistName && collection.artistName
                      }
                      artistImg={collection?.artistImg && collection.artistImg}
                    />
                  </div>
                );
              })}
        </Slider>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 70 }}>
      <Tabs tabContents={tabContents} setCurrentTab={setCurrentTab} />
      <Contents />
    </div>
  );
}

export default SuggestionNfts;
