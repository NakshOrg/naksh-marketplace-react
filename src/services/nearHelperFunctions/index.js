import { utils } from 'near-api-js';

import configs from '../../configs';
import { _getAllArtists, _getOneArtist } from '../axios/api';


export default function NearHelperFunctions(wallet) {

  this.getAllListedNfts = async (allNfts, getAllNft) => {
    
    const res = await wallet.account()
    .viewFunction(
      configs.nakshMarketWallet, 
      'get_sales_by_nft_contract_id', 
      { 
        nft_contract_id: configs.nakshContractWallet,
        from_index: "0", 
        limit: 1000 
      }
    )

    const { data: { artists } } = await _getAllArtists({sortBy: 'createdAt', sort: -1});
    const filteredNfts = [];

    allNfts.map(nftItem => {
      
      nftItem.metadata['extra'] = JSON.parse(nftItem.metadata.extra);
      const listedItem = res.find(t => t.token_id === nftItem.token_id);
      const artist = artists.find(a => a._id === nftItem?.metadata?.extra?.artistId);
      
      if(artist) {
        nftItem['artist'] = artist;
      }

      if(listedItem) {
        nftItem["listed"] = true;
        nftItem["price"] = utils.format.formatNearAmount(listedItem.sale_conditions);
        filteredNfts.push(nftItem);
      }

    });

    if(getAllNft) return allNfts;

    return filteredNfts;
  }

  this.getAllNfts = async (getAllNft) => {

    const res = await wallet.account()
    .viewFunction(
      configs.nakshContractWallet, 
      'nft_tokens', 
      { 
        from_index: "0", 
        limit: 1000 
      }
    );

    const nftsWithPrice = await this.getAllListedNfts(res, getAllNft); // to get nft price

    return nftsWithPrice;

  };

  this.getNftDetails = async () => {

    const allNfts = await wallet.account()
    .viewFunction(
      configs.nakshContractWallet, 
      'nft_tokens', 
      { 
        from_index: "0", 
        limit: 1000 
      }
    );

    const listedNfts = await wallet.account()
    .viewFunction(
      configs.nakshMarketWallet, 
      'get_sales_by_nft_contract_id', 
      { 
        nft_contract_id: configs.nakshContractWallet,
        from_index: "0", 
        limit: 1000 
      }
    )

    const { data: { artists } } = await _getAllArtists({sortBy: 'createdAt', sort: -1});

    allNfts.map(nftItem => {
      
      nftItem.metadata['extra'] = JSON.parse(nftItem.metadata.extra);
      const listedItem = listedNfts.find(t => t.token_id === nftItem.token_id);
      const artist = artists.find(a => a._id === nftItem?.metadata?.extra?.artistId);
      
      if(artist) {
        nftItem['artist'] = artist;
      }

      if(listedItem) {
        nftItem["listed"] = true;
        nftItem["price"] = utils.format.formatNearAmount(listedItem.sale_conditions);
      }

    });


    return allNfts;

  }

  this.getOwnedNfts = async (accountId) => {
    console.log(accountId, "ll");
    const res = await wallet.account()
    .viewFunction(
      configs.nakshContractWallet, 
      'nft_tokens_for_owner', 
      { 
        account_id: accountId, 
        from_index: "0", 
        limit: 1000
      }
    );

    const { data: { artists } } = await _getAllArtists({sortBy: 'createdAt', sort: -1});
    const item = artists.find(item => item.wallet === accountId);
    res.map(nft => nft['artist'] = item);   

    return res;
  }

  this.buyNFt = async (price, token_id) => {

    const gas = 200000000000000;
    const attachedDeposit = utils.format.parseNearAmount(price);
    const FunctionCallOptions = {
        contractId: configs.nakshMarketWallet,
        methodName: 'offer',
        args: {
            nft_contract_id: configs.nakshContractWallet,
            token_id: token_id
        },
        gas,
        attachedDeposit
    };
  
    const data = await wallet.account().functionCall(FunctionCallOptions);

  }

}
  