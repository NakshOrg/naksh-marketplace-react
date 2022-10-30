import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppContext } from "../../../context/wallet";
import { useNFTs } from "../../../hooks";
import useCollection from "../../../hooks/useCollection";
import facebook from "../../../assets/svgs/facebook.svg";
import instagram from "../../../assets/svgs/instagram.svg";
import website from "../../../assets/svgs/website.svg";
import twitter from "../../../assets/svgs/twitter.svg";
import {
  GradientBtn,
  OutlineBtn,
} from "../../../components/uiComponents/Buttons";
import NftCard from "../../../components/explore/NftCard";
import { Col, Row } from "react-bootstrap";
import classes from "../../browse/browse.module.css";
import { ethers } from "ethers";
import helpers from "../../../constants/helpers"

const CollectionDetails = () => {
  const { evmWalletData, evmProvider, NAKSH_ADDRESS_1155 } = useAppContext();
  const { getCollection, getCollectionNFTs } = useCollection();
  const { getSoldNFTs } = useNFTs();
  const params = useParams();
  const history = useHistory();

  const [collection, setCollection] = useState();
  const [nfts, setNFTs] = useState([]);
  const [isItems, setIsItems] = useState(true);
  const [viewMore, setViewMore] = useState(false);
  const [volume, setVolume] = useState(0);
  const [owners, setOwners] = useState(0);
  const [soldNfts, setSoldNfts] = useState([]);

  const fetchCollection = async () => {
    const collections = await getCollection(params.address.toLowerCase().toLowerCase());
    const nfts = await getCollectionNFTs(params.address.toLowerCase());

    let uniqueOwner = {};

    let copy = nfts.filter(item => item.owner.toLowerCase() !== NAKSH_ADDRESS_1155.toLowerCase())
    
    copy.map((nft) => (uniqueOwner[nft.owner] = true));

    setOwners(Object.keys(uniqueOwner).length);
    setCollection(collections);
    setNFTs(copy);
  };

  const calculateVolume = async () => {
    const soldNfts = await getSoldNFTs(params.address.toLowerCase());
    const sorted = soldNfts.sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp)
    );
    setSoldNfts(soldNfts);

    let volume = 0;

    soldNfts.map((s) => (volume += Number(ethers.utils.formatEther(s.price))));

    setVolume(volume);
  };

  useEffect(() => {
    if (evmProvider) {
      fetchCollection();
      calculateVolume();
    }
  }, [evmProvider]);

  const showHistory = () => {
    return (
      <>
        <div className="space-y-4 w-full pt-5 bg-transparent flex flex-col justify-center items-start pr-10">
          {soldNfts &&
            soldNfts.length > 0 &&
            soldNfts.map((soldNft) => (
              <div className="w-full border-b pb-2 flex justify-around items-center">
                <div className="w-1/2 space-y-2  flex flex-col justify-center items-start">
                  <h1 className="text-lg">
                    <span className="font-bold">{soldNft.nft.title}</span>{" "}
                    bought by{" "}
                    <span className="font-bold">
                      {soldNft.buyer.substring(0, 7)}...
                    </span>{" "}
                    from{" "}
                    <span className="font-bold">
                      {soldNft.seller.substring(0, 7)}...
                    </span>
                  </h1>
                  <p className="text-sm text-gray-400">
                    {new Date(soldNft.timestamp * 1000).toString()}
                  </p>
                </div>
                <div className="w-1/2 space-y-2  flex flex-col justify-center items-end">
                  <h1 className="text-lg font-bold">
                    ${ethers.utils.formatEther(soldNft.price)} MATIC
                  </h1>
                </div>
              </div>
            ))}
          {soldNfts.length === 0 && (
            <h1 className="text-xl font-bold">No Bids Found</h1>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full space-y-10 min-h-screen md:mt-[105px] sm:mt-0">
      {/* <div className="w-full h-96" style={!collection.cover.isGradient ? { backgroundImage:`url("${collection.cover.uri}")`} : { background: collection.cover.uri }}></div> */}
      {collection && (
        <>
          {collection.isGradient && (
            <div
              className="w-full h-96"
              style={{
                background: collection.coverUri,
              }}
            ></div>
          )}
          {!collection.isGradient && (
            <img
              src={collection.coverUri}
              className={`w-full h-96 flex justify-center items-center`}
            />
          )}
          <div className="w-full h-full flex flex-col md:flex-row justify-start items-center md:items-start">
            <div className="-mt-40 w-11/12 md:w-1/4 h-full md:mx-20 bg-black/75 backdrop-blur-lg rounded-xl p-10 flex flex-col justify-start items-center space-y-5">
              <div className="rounded-full flex justify-center items-center  w-40 h-40">
                <img
                  src={collection.logo}
                  className="w-full h-full rounded-full"
                />
              </div>
              <h1 className="font-bold text-3xl">{collection.name}</h1>
              <p className="text-gray-400">
                Created by {collection.creator?.substring(0, 7)}...
              </p>
              <p className="text-center">
                {!viewMore &&
                  collection.description &&
                  collection.description?.substring(0, 150)}
                {viewMore && collection.description}
                {collection.description?.length > 150 && (
                  <>
                    {viewMore ? (
                      <span
                        className="text-blue-700 cursor-pointer"
                        onClick={() => setViewMore(!viewMore)}
                      >
                        {" "}
                        view less...
                      </span>
                    ) : (
                      <span
                        className="text-blue-700 cursor-pointer"
                        onClick={() => setViewMore(!viewMore)}
                      >
                        {" "}
                        view more...
                      </span>
                    )}
                  </>
                )}
              </p>
              <div className="w-full flex justify-center items-center space-x-5">
                {collection.facebook && (
                  <img
                    onClick={() => helpers.openInNewTab(collection.facebook)}
                    src={facebook}
                    className="w-10 h-10 bg-white rounded-full p-2 cursor-pointer"
                  />
                )}
                {collection.twitter && (
                  <img
                    onClick={() => helpers.openInNewTab(collection.twitter)}
                    src={twitter}
                    className="w-10 h-10 bg-white rounded-full p-2 cursor-pointer"
                  />
                )}
                {collection.instagram && (
                  <img
                    onClick={() => helpers.openInNewTab(collection.instagram)}
                    src={instagram}
                    className="w-10 h-10 bg-white rounded-full p-2 cursor-pointer"
                  />
                )}
                {collection.website && (
                  <img
                    onClick={() => helpers.openInNewTab(collection.website)}
                    src={website}
                    className="w-10 h-10 bg-white rounded-full p-2 cursor-pointer"
                  />
                )}
              </div>
              {collection.creator?.toLowerCase() ===
                evmWalletData.address.toLowerCase() && (
                <div className="w-full h-full flex flex-col justify-start items-center mt-10 pt-10 space-y-8">
                  <div className="w-1/2 flex justify-end items-center space-x-4">
                    <GradientBtn
                      onClick={() => history.push("/create/nft")}
                      content="MINT NFT"
                      style={{ width: "187px" }}
                    />
                  </div>
                  {/* <div className="w-1/2 flex justify-end items-center space-x-4">
                    <OutlineBtn
                      text="EDIT COLLECTION"
                      style={{ width: "187px", color: "#fff" }}
                    />
                  </div> */}
                </div>
              )}
            </div>
            <div className="w-3/4 h-full space-y-5">
              <div className="w-full space-y-4 md:space-y-0 flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-1/2 flex justify-start items-center space-x-4">
                  <h3
                    className={
                      (isItems ? "border-b-2 border-b-white border-" : "") +
                      " cursor-pointer"
                    }
                    onClick={() => setIsItems(true)}
                  >
                    Items
                  </h3>
                  <h3
                    className={
                      (!isItems ? "border-b-2 border-b-white border-" : "") +
                      " cursor-pointer"
                    }
                    onClick={() => setIsItems(false)}
                  >
                    Activity
                  </h3>
                </div>
                <div className="w-full md:w-1/2 flex justify-start md:justify-end items-center space-x-4 md:px-10">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">
                      {nfts && <>{nfts.length}</>}
                    </h3>
                    <h3>Items</h3>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{owners}</h3>
                    <h3>Owners</h3>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{volume} MATIC</h3>
                    <h3>Volume Traded</h3>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {nfts.length <= 0 &&
                  evmWalletData.address.toLowerCase() ===
                    collection.creator?.toLowerCase() && (
                    <div
                      onClick={() => history.push(`/create/nft/`)}
                      className="w-1/2 flex justify-center items-center"
                    >
                      <GradientBtn
                        content={"MINT A NFT"}
                        style={{ width: "187px", color: "#fff" }}
                      />
                    </div>
                  )}
              </div>
              {isItems && (
                <div className={classes.nftContainer}>
                  <Row>
                    {nfts.length > 0 &&
                      nfts.map((nft) => (
                        <>
                          <Col
                            style={{ marginBottom: 25 }}
                            lg={3}
                            md={4}
                            sm={6}
                            xs={12}
                          >
                            <NftCard
                              onClick={() =>
                                history.push(
                                  nft?.erc721
                                    ? `/polygon/nftdetails/${
                                        nft.nftAddress
                                      }/${nft.tokenId.toString()}`
                                    : `/polygon/${nft.owner}/${
                                        nft.nftAddress
                                      }/${nft.tokenId.toString()}`
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
                              artistName={`${nft.creator.substring(0, 7)}...`}
                              artistImage={nft.artistImg}
                            />
                          </Col>
                        </>
                      ))}
                  </Row>
                  <div style={{ marginBottom: 50 }} />
                  <div className={classes.exploreGradientPink} />
                </div>
              )}
              {!isItems && showHistory()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionDetails;
