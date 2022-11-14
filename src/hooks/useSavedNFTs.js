import axios from "axios";
import configs from "../configs";

export const useSavedNFTs = () => {
  const saveNFT = async (artistId, nftData) => {
    try {
      const res = await axios({
        url: `${configs.baseURL}/artist/saveNft`,
        method: "PATCH",
        params: {
          id: artistId,
        },
        data: nftData,
      });

      const data = await res.data;

      return data;
    } catch (e) {}
  };

  const removeNFT = async (artistId, nftData) => {
    try {
      const res = await axios({
        url: `${configs.baseURL}/artist/unsaveNft`,
        method: "PATCH",
        params: {
          id: artistId,
        },
        data: nftData,
      });

      const data = await res.data;

      return data;
    } catch (e) {}
  };

  return {
    saveNFT,
    removeNFT,
  };
};
