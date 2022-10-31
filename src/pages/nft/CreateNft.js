import { useEffect, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { HiPlusCircle } from "react-icons/hi";
import { FiMinus, FiPlus } from "react-icons/fi";

import { GradientBtn } from "../../components/uiComponents/Buttons";
import ListNftModal from "../../components/create/ListNftModal";
import { useNFTs } from "../../hooks";
import { ethers } from "ethers";
import { useAppContext } from "../../context/wallet";
import useCollection from "../../hooks/useCollection";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { helpers } from "../../constants";
import { FiX } from "react-icons/fi";
import { _getAllArtists } from "../../services/axios/api";

const NAKSH_NFT_ADDRESS = "0xABb0f60525470913ff90128555E35D6EC3Dc1f06";
const NAKSH_NFT_ADDRESS_1155 = "0x0f2Fd40C8c0Dc19e625bb3777db1595792Afe172";

export default function CreateNft(props) {
  const { evmWalletData, evmProvider } = useAppContext();
  const { mintNft, uploadMedia, listNFT, bulkMint, listNFT1155 } = useNFTs();
  const { getUserCollections, getRoyalties } = useCollection();

  const [royalty, setRoyalty] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState(NAKSH_NFT_ADDRESS);
  const [artform, setArtform] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [image, setImage] = useState();
  const [preview, setPreview] = useState("");
  const [tags, setTags] = useState([]);

  const [artist, setArtist] = useState()

  const [value, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(1);
  const [auctionTime, setAuctionTime] = useState(1);

  const [userCollections, setUserCollections] = useState([]);
  const [royaltyPerc, setRoyaltyPerc] = useState(0);

  const [royalties, setRoyalties] = useState([{ wallet: "", percentage: "" }]);

  const [listModal, setListModal] = useState(false);

  const ref = useRef(null);

  const history = useHistory();

  useEffect(() => {
    if (!collection && userCollections.length > 0)
      setCollection(userCollections[0].nftAddress);
  }, [userCollections]);

  useEffect(() => {
    if(evmWalletData) {
      _getAllArtists({
        wallet: evmWalletData.address,
        sortBy: "createdAt",
        sort: -1,
      })
        .then(({ data: { artists } }) => {
          if(artists.length > 0) setArtist(artists[0])
        })
    }
  }, [evmWalletData])

  useEffect(() => {
    if (collection) {
      console.log(collection);
      if (ethers.utils.isAddress(collection)) {
        getRoyalties(collection).then((res) => {
          console.log(Number(res._creatorRoyalty) / 100);
          setRoyaltyPerc(Number(res._creatorRoyalty) / 100);
        });
      }
    }
  }, [collection]);

  const changeRoyalties = (index, wallet = "", percentange = "") => {
    setRoyalties((v) => {
      let a = [...v];

      if (index < a.length) {
        a[index].wallet = wallet ? wallet : a[index].wallet;
        a[index].percentage = percentange ? percentange : a[index].percentage;
      } else {
        for (let i = a.length; i <= index; i++) {
          if (i === index) a.push({ wallet: wallet, percentage: percentange });
          else a.push({ wallet: "", percentage: "" });
        }
      }

      return a;
    });
  };

  const incrementRoyalty = () => {
    if (royalty >= 6) return;
    setRoyalty(() => royalty + 1);
  };

  const changeQuantity = (value, operation = "+") => {
    if (operation === "+") {
      setQuantity((q) => q + value);
    } else {
      if (quantity === 1) {
        return;
      }
      setQuantity((q) => q - value);
    }
  };

  const mint = async () => {
    let errorList = [];

    if (!name) errorList.push("Name");
    if (!description) errorList.push("Description");
    if (!collection) errorList.push("Collection");
    if (!image) errorList.push("Image");

    if (errorList.length > 0) {
      toast.error(`${errorList.join(", ")} cannot be null`);
      return;
    }

    const toastId = toast.loading("Uploading NFT");
    let erc721 = true

    if(collection.toLowerCase() === NAKSH_NFT_ADDRESS.toLowerCase()) erc721 = true
    
    const collectionDetails = userCollections.find(c => c.id.toLowerCase() === collection)

    erc721 = collectionDetails ? collectionDetails.erc721 : erc721

    
    try {
      if(!erc721) {
        if(image) {
          const img = await uploadMedia(image)
          
          toast.loading("Successfully uploaded NFT on IPFS, Minting now...", {
            id: toastId,
          });

          const nft = await bulkMint(
            collection,
            `ipfs://${img}`,
            name,
            description,
            artist ? artist.name : evmWalletData.address,
            artist ? artist.image : "",
            quantity,
            image.type.startsWith("video") ? true : false
          );
          toast.success("Successfully minted NFT", {
            id: toastId,
          });
          return nft;
        }
      } else {
        if (image) {
          const img = await uploadMedia(image);
          toast.loading("Successfully uploaded NFT on IPFS, Minting now...", {
            id: toastId,
          });
          
          const nft = await mintNft(
            collection,
            `ipfs://${img}`,
            name,
            description,
            artist ? artist.name : evmWalletData.address,
            artist ? artist.image : "",
            image.type.startsWith("video") ? true : false
          );
          toast.success("Successfully minted NFT", {
            id: toastId,
          });
          return nft;
        }
      }

    } catch (e) {
      toast.error("Faced issue in minting nft", {
        id: toastId
      })
      console.error(e);
    }
  };

  const enlistLaterMint = async () => {
    const token = await mint();

    let erc721 = true;
    if (collection.toLowerCase() === NAKSH_NFT_ADDRESS.toLowerCase()) erc721 = true;

    const collectionDetails = userCollections.find(
      (c) => c.id.toLowerCase() === collection
    );

    erc721 = collectionDetails ? collectionDetails.erc721 : erc721;

    if (erc721)
      history.push(
        `/polygon/nftdetails/${collection}/${ethers.utils
          .stripZeros(token.tokenId)
          .toString()}`
      );
    else
      history.push(
        `/polygon/${evmWalletData.address}/${collection}/${token.tokenId}`
      ); 
  };

  const listAndMint = async () => {
    const token = await mint();

    // console.log({ nftAddress: collection, tokenId: ethers.utils.stripZeros(token.tokenId).toString() })
    let erc721 = true
    if (collection.toLowerCase() === NAKSH_NFT_ADDRESS.toLowerCase())
      erc721 = true;

    const collectionDetails = userCollections.find(
      (c) => c.id.toLowerCase() === collection.toLowerCase()
    );

    erc721 = collectionDetails ? collectionDetails.erc721 : erc721;

    if (selectedValue === 0) {
      if(erc721) {
        await listNFT(
          {
            nftAddress: collection,
            tokenId: ethers.utils.stripZeros(token.tokenId).toString(),
          },
          selectedValue,
          { price: ethers.utils.parseEther(price).toString() }
        );
      } else {
        await listNFT1155(
          {
            nftAddress: collection,
            tokenId: token.tokenId,
          },
          selectedValue,
          Number(quantity),
          {
            price: ethers.utils.parseEther(price).toString(),
          }
        );
      }
    }
    else {
      const currDate = new Date();
      const currUnix = currDate.getTime() / 1000;

      currDate.setDate(currDate.getDate() + (days ? Number(days) : 1));
      // console.log(currDate)
      const nextUnix = currDate.getTime() / 1000;

      // console.log(nextUnix - currUnix)

      await listNFT(
        {
          nftAddress: collection,
          tokenId: ethers.utils.stripZeros(token.tokenId).toString(),
        },
        selectedValue,
        {
          auctionTime: nextUnix - currUnix,
          price: ethers.utils.parseEther(price).toString(),
        }
      );
    }

    if(erc721) history.push(
      `/polygon/nftdetails/${collection}/${ethers.utils
        .stripZeros(token.tokenId)
        .toString()}`
    );
    else history.push(
      `/polygon/${evmWalletData.address}/${collection}/${token.tokenId}`
    ); 
  };

  const uploadFile = (e) => {
    ref.current.click();
  };

  const addTag = (tag) => {
    setTags((val) => {
      let shallow = [...val];

      shallow.push(tag);

      return shallow;
    });
  };

  const removeTag = (idx) => {
    setTags((val) => {
      let shallow = [...val];

      shallow.splice(idx, 1);
      // console.log(shallow)

      return shallow;
    });
  };

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
    }
  }, [image]);

  useEffect(() => {
    // console.log(royalties)

    let perc = 0;

    for (let i = 0; i < royalties.length; i++) {
      perc += Number(royalties[i].percentage);
    }

    setRoyaltyPerc(perc / 100);
  }, [royalties]);

  useEffect(() => {
    if (evmProvider) {
      getUserCollections(evmWalletData.address)
        .then((res) => setUserCollections(res))
        .catch((e) => console.error(e));
    }
  }, [evmProvider]);

  return (
    <div
      onClick={() => (listModal ? setListModal(false) : {})}
      className="w-full space-y-10 h-full md:mt-[105px] sm:mt-0 mt-20 md:px-[8%] sm:px-0 mb-20 px-10"
    >
      <div
        className={
          (listModal ? "filter blur-2xl " : "") +
          " w-full flex justify-around items-center"
        }
      >
        <div className="w-1/2 flex justify-start items-center space-x-4">
          <span className="text-xl font-bold">&larr;</span>
          <h1 className="text-3xl font-bold">Create NFT</h1>
        </div>
        <div className="w-1/2 flex justify-end items-center space-x-4">
          <GradientBtn
            onClick={() => setListModal(true)}
            content="MINT NFT"
            style={{ width: "187px" }}
          />
        </div>
      </div>
      <p className={listModal ? "filter blur-2xl " : ""}>NFT DETAILS</p>
      <div
        className={
          (listModal ? "filter blur-2xl " : "") +
          " w-full h-full md:flex-row flex-col flex justify-center items-center md:items-start space-y-5 md:space-y-0 md:space-x-5"
        }
      >
        <div className="relative w-full md:w-1/3 h-[500px] flex flex-col justify-center items-start">
          <input
            ref={ref}
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full hidden h-full absolute bg-transparent z-50 cursor-pointer"
            type="file"
          />
          <div
            onClick={(e) => uploadFile(e)}
            className="cursor-pointer w-full h-full flex flex-col justify-center items-center p-5 bg-brand-gray"
          >
            {image && (
              <>
                <img src={preview} className="w-1/2 border" />
                <h3 className="text-xl font-bold">{image.name}</h3>
                <div className="flex flex-col justify-center items-center">
                  <FiUploadCloud className="w-1/2 h-1/2" />
                  <h3 className="text-md font-bold">Change NFT here</h3>
                  <p className="text-gray-500 text-sm text-center">
                    (Supports JPEG, .jpg, .png, .mp4 format)
                  </p>
                </div>
              </>
            )}
            {!image && (
              <>
                <FiUploadCloud className="w-full h-1/2" />
                <h3 className="text-xl font-bold">Upload your NFT here</h3>
                <p className="text-gray-500">
                  (Supports JPEG, .jpg, .png, .mp4 format)
                </p>
              </>
            )}
          </div>
        </div>
        <div className="w-full px-0 md:w-2/3 h-full space-y-6 flex flex-col justify-center items-center">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full p-3 text-white bg-brand-gray"
            placeholder="Name*"
          />
          <div className="w-full space-y-3 flex flex-col justify-center items-end">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              id="desc"
              className="w-full bg-brand-gray p-3"
              placeholder="Description*"
              rows={8}
            ></textarea>
            <p>{description.length}/300</p>
          </div>
          <div className="w-full space-x-4 flex justify-around items-start">
            <div className="w-full flex flex-col justify-center items-center space-y-4">
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTag(e.target.value);
                }}
                className="w-full p-3 bg-brand-gray"
                type="string"
                placeholder="Artform"
              />
              {tags && tags.length > 0 && (
                <div className="w-full flex space-x-3 bg-brand-gray rounded-xl py-3 px-2">
                  {tags.map((tag, idx) => (
                    <div className="flex justify-center items-center space-x-1 p-2 bg-[#20263B] text-white rounded-xl">
                      <p className="text-xl">{tag}</p>
                      <FiX
                        onClick={() => removeTag(idx)}
                        className="text-xl cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="w-full p-3 text-white bg-brand-gray"
              name="collection"
              id="collection"
              placeholder="Collection"
            >
              <option value={NAKSH_NFT_ADDRESS}>Generic</option>
              {userCollections.length > 0 &&
                userCollections.map((collection) => (
                  <option value={collection.nftAddress}>
                    {collection.name.length > 32 ? collection.name.substring(0, 32) + "..." : collection.name}
                  </option>
                ))}
              <option
                onClick={() => {
                  const a = document.createElement("a");
                  a.setAttribute(
                    "href",
                    `${window.location.protocol}//${window.location.host}/create/collection`
                  );
                  a.setAttribute("target", "_blank");
                  a.click();
                }
                }
                className=""
              >
                + Create New
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        className={
          (listModal ? "filter blur-2xl " : "") +
          "w-full flex flex-col justify-start items-start"
        }
      >
        <h1 className="text-lg font-bold">PRICING TYPE</h1>
        <div className="w-full flex justify-start space-x-4 items-center">
          <div
            onClick={() => setSelectedValue(0)}
            className={
              "p-5 cursor-pointer h-full text-bold border-2 border-white rounded-xl flex flex-col justify-center items-center" +
              (selectedValue === 0 ? " bg-white text-black" : "")
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
            <span className="text-xl">Fixed Price</span>
          </div>
          <div
            onClick={() => setSelectedValue(1)}
            className={
              "p-5 cursor-pointer h-full text-bold border-2 border-white rounded-xl flex flex-col justify-center items-center" +
              (selectedValue === 1 ? " bg-white text-black" : "")
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
            <span className="text-md md:text-lg lg:text-xl">Timed Auction</span>
          </div>
        </div>
      </div>
      <div className={(listModal ? "filter blur-2xl " : "") + " space-y-4 "}>
        <h1 className="text-lg font-bold">PRICING AND QUANTITY</h1>
        <div className="w-full h-full space-x-4 md:flex-row flex-col flex justify-center items-start">
          <div className="w-full md:w-1/2 h-full space-y-4 flex flex-col justify-center items-start">
            <div className="w-full p-4 flex justify-center items-center bg-brand-gray">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="text"
                className="w-full p-0 text-white bg-brand-gray"
                placeholder="Price for one item"
              />
              <p className="text-md p-0">MATIC</p>
            </div>
            {selectedValue === 1 && (
              <div className="w-full p-4 flex justify-center items-center bg-brand-gray">
                <input
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  type="text"
                  className="w-full p-0 text-white bg-brand-gray"
                  placeholder="How many days you want to auction?"
                />
                <p className="text-md p-0">DAYS</p>
              </div>
            )}
            <div className="w-full h-full flex justify-between items-center">
              <div className="w-1/2 flex flex-col justify-center items-start space-y-2">
                <h2>
                  Royalties: <span className="font-bold">{royaltyPerc}%</span>
                </h2>
                <h2>
                  Platform Fee: <span className="font-bold">5%</span>
                </h2>
              </div>
              <div className="w-1/2 flex flex-col justify-start items-end space-y-2">
                <h2>
                  You Will Receive:{" "}
                  <span className="font-bold">
                    {Number(price) -
                      Number(price) * 0.05 -
                      Number(price) * (royaltyPerc / 100)}{" "}
                    MATIC
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full py-3 md:py-0 md:px-5 space-x-4 flex justify-center md:justify-end items-center">
            <h1 className="text-md font-normal text-gray-400">
              Quantity
            </h1>
            <div className="flex justify-center items-center space-x-3">
              <FiMinus
                onClick={() => changeQuantity(1, "-")}
                className="text-3xl cursor-pointer"
              />
              <h2 className="p-2 text-3xl bg-brand-gray">{quantity}</h2>
              <FiPlus
                onClick={() => changeQuantity(1)}
                className="text-3xl cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          (!listModal ? "hidden" : "") +
          " filter-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        }
      >
        <ListNftModal mint={enlistLaterMint} listAndMint={listAndMint} />
      </div>
    </div>
  );
}
