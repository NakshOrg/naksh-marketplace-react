import axios from "axios";
import configs from "../configs";
import { useNFTs } from "./useNFT";

export const useTrendingNFTs = () => {
  const { getManyNFTs, getNFTsOnSale } = useNFTs();

  const updateTrendingNFT = (nftAddress, tokenId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          url: `${configs.baseURL}/nft/trending`,
          method: "PATCH",
          params: {
            token: `${nftAddress}-${tokenId}`,
            blockchain: "1",
            artist: "613462492fce3262612de300",
          },
          data: {
            view: 1,
          },
        });

        const data = await res.data;

        resolve(data.nft);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const getTrendingNFTs = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(configs.baseURL)
        const res = await axios({
          url: `${configs.baseURL}/nft/trending`,
          method: "GET",
          params: {
            blockchain: "1",
          },
        });

        const data = await res.data;
        const trendingNfts = data.nfts.sort((a, b) => b.trending - a.trending);

        const trendingNftsUnique = [
          ...new Map(trendingNfts.map((item) => [item["token"], item])).values(),
        ];

        
        const nfts = await getManyNFTs(trendingNftsUnique.map((d) => d.token));
        
        const sellingNFTs = await getNFTsOnSale();
        // console.log(sellingNFTs)

        let newNFTs = [];

        nfts.map((n, idx) => {
          let found = false
          sellingNFTs.map((nft) => {
            if (n.id === nft.id) {
              
              newNFTs.push({
                salePrice: nft.salePrice,
                ...n,
              });

              found = true
              return
            }
          });

          // console.log(idx, newNFTs.length)

          if (!found) {
            newNFTs.push({
              salePrice: 0,
              ...n,
            });
          }
        });

        resolve(newNFTs);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };

  return {
    updateTrendingNFT,
    getTrendingNFTs,
  };
};
