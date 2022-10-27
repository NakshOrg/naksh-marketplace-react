import { ethers } from "ethers";

import factoryAbi from "../interface/factoryAbi.json";
import nftAbi from "../interface/nftAbi.json";
import { useAppContext } from "../context/wallet";
import toast from "react-hot-toast";
import {
  GET_COLLECTION,
  GET_COLLECTIONS,
  GET_COLLECTION_NFTS,
  GET_SINGLE_NFT,
  GET_USER_COLLECTION,
} from "./useGraphApi";

const useCollection = () => {
  const { NAKSH_FACTORY_ADDRESS, evmWalletData, evmProvider } = useAppContext();

  const getRoyalties = async (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const contract = new ethers.Contract(
          address,
          nftAbi,
          await ethers.getDefaultProvider(
            "https://polygon-mumbai.g.alchemy.com/v2/Tv9MYE2mD4zn3ziBLd6S94HvLLjTocju"
          )
        );
        const data = await contract.getRoyalties();

        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  };

  const getCollection = (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(
          "https://api.thegraph.com/subgraphs/name/sk1122/naksh",
          {
            method: "POST",
            body: JSON.stringify({
              query: GET_COLLECTION,
              variables: {
                address
              },
            }),
          }
        );
        const collection = (await res.json()).data.collection;

        resolve(collection);
      } catch (e) {
        // console.log(e, "error")
        reject(e);
      }
    });
  };

  const getCollections = (skip = 0) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(
          "https://api.thegraph.com/subgraphs/name/sk1122/naksh",
          {
            method: "POST",
            body: JSON.stringify({
              query: GET_COLLECTIONS,
              variables: {
                skip,
              },
            }),
          }
        );
        const collections = (await res.json()).data.collections;

        resolve(collections);
      } catch (e) {
        // console.log(e, "error")
        reject(e);
      }
    });
  };

  const createCollection = (
    name,
    symbol,
    socialMedia,
    coverUri,
    isGradient,
    about,
    logo,
    admin,
    creatorFees,
    creators,
    artistName,
    artistImg
  ) => {
    // @types

    // struct SocialMediaData {
    //     string instagram;
    //     string facebook;
    //     string twitter;
    //     string website;
    // }

    // struct CoverImage {
    //     string uri;
    //     bool isGradient;
    // }

    // struct CollectionDetails {
    //     string name;
    //     string symbol;
    //     string about;
    //     string logo;
    //     CoverImage cover;
    //     SocialMediaData social;
    // }

    // struct artistDetails {
    //     string name;
    //     address artistAddress;
    //     string imageUrl;
    // }

    return new Promise(async (resolve, reject) => {
      const toastId = toast.loading("Creating a collection");
      try {
        const socialMediaData = [
          socialMedia.instagram,
          socialMedia.facebook,
          socialMedia.twitter,
          socialMedia.website,
        ];

        const coverImage = [coverUri, isGradient];

        const collectionDetails = [
          name,
          symbol,
          about,
          logo,
          coverImage,
          socialMediaData,
        ];

        const artistDetails = [
          artistName,
          admin,
          artistImg,
        ];

        // console.log(artistDetails, collectionDetails, "params")

        const contract = new ethers.Contract(
          NAKSH_FACTORY_ADDRESS,
          factoryAbi,
          evmWalletData.signer
        );
        // console.log(NAKSH_FACTORY_ADDRESS, artistDetails, collectionDetails, admin, creatorFees, creators)
        const tx = await contract.deployNftCollection(
          artistDetails,
          collectionDetails,
          admin,
          creatorFees[0] === "" ? [] : creatorFees,
          creators[0] === "" ? [] : creators,
          {
            gasPrice: evmProvider.getGasPrice(),
            gasLimit: 10000000,
          }
        );

        await tx.wait();
        toast.success("Successfully created a collection", {
          id: toastId,
        });
        resolve(tx);
      } catch (e) {
        toast.success("Can't create a collection", {
          id: toastId,
        });
        reject(e);
      }
    });
  };

  const getCollectionNFTs = (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(
          "https://api.thegraph.com/subgraphs/name/sk1122/naksh",
          {
            method: "POST",
            body: JSON.stringify({
              query: GET_COLLECTION_NFTS,
              variables: {
                nftAddress: address,
              },
            }),
          }
        );
        const nft = (await res.json()).data.nftdatas;
        // console.log(nft)

        resolve(nft);
      } catch (e) {
        // console.log(e, "error")
        reject(e);
      }
    });
  };

  const getUserCollections = (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(
          "https://api.thegraph.com/subgraphs/name/sk1122/naksh",
          {
            method: "POST",
            body: JSON.stringify({
              query: GET_USER_COLLECTION,
              variables: {
                creator: address,
              },
            }),
          }
        );
        const nft = (await res.json()).data.collections;
        // console.log(nft)

        resolve(nft);
      } catch (e) {
        // console.log(e, "error")
        reject(e);
      }
    });
  };

  const getUserCollectionsAndAssets = (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const collections = await getUserCollections(address);

        let c = [];

        for (let i = 0; i < collections.length; i++) {
          const assets = await getCollection(collections[i].nftAddress);

          c.push({
            logo: assets.logo,
            coverUri: !assets.cover.isGradient ? assets.cover.coverUri : "",
            ...collections[i],
          });
        }

        resolve(c);
      } catch (e) {
        reject(e);
      }
    });
  };

  return {
    getCollection,
    getCollections,
    createCollection,
    getCollectionNFTs,
    getUserCollections,
    getUserCollectionsAndAssets,
    getRoyalties,
  };
};

export default useCollection;
