import { utils } from 'near-api-js';

import configs from '../../configs';
import { _getAllArtists, _getOneArtist } from '../axios/api';


export default function NearHelperFunctions(wallet, paramsId) {

  this.getMintedNft = async () => {

    const allNfts = await wallet.account()
    .viewFunction(
      configs.nakshContractWallet, 
      'nft_tokens', 
      { 
        from_index: "0", 
        limit: 1000 
      }
    );

    const contractNfts = await wallet.account()
    .viewFunction(
      configs.nakshMarketWallet, 
      'get_sales_by_nft_contract_id', 
      { 
        nft_contract_id: configs.nakshContractWallet,
        from_index: "0", 
        limit: 1000 
      }
    );

    const { data: { artists } } = await _getAllArtists({ sortBy: 'createdAt', sort: -1 });

    const contractNftIds = contractNfts.map(item => item.token_id);
    const unlistedNfts = allNfts.filter(nft => !contractNftIds.includes(nft.token_id)); 

    const mintedNfts = unlistedNfts.filter(nft => {

      if (nft.owner_id === wallet.getAccountId()) {
        const artist = artists.find(artist => artist._id === nft?.metadata?.extra?.artistId);
        if (artist) nft['artist'] = artist;
        nft.metadata['extra'] = JSON.parse(nft.metadata.extra);
        return nft;
      }

    });
    
    return mintedNfts;

  }

  this.getMyListedNfts = async () => {
    
    const allNfts = await wallet.account()
    .viewFunction(
      configs.nakshContractWallet, 
      'nft_tokens', 
      { 
        from_index: "0", 
        limit: 1000 
      }
    );

    const myNfts = await wallet.account()
    .viewFunction(
      configs.nakshMarketWallet, 
      'get_sales_by_nft_contract_id', 
      { 
        nft_contract_id: configs.nakshContractWallet,
        from_index: "0", 
        limit: 1000 
      }
    )
      // return res.filter(item => item.owner_id === wallet.getAccountId());
    const { data: { artists } } = await _getAllArtists({sortBy: 'createdAt', sort: -1});
    const filteredNfts = [];

    allNfts.map(nftItem => {
      
      nftItem.metadata['extra'] = JSON.parse(nftItem.metadata.extra);
      const listedItem = myNfts.find(t => t.owner_id === nftItem.owner_id);
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

    return filteredNfts;
  }

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
    // console.log(accountId, "ll");
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

  this.getSalesNft = async () => {
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
    return res
  }

  this.nearListing = async (nftDetails) => {

    const msg = JSON.stringify({
        sale_conditions: utils.format.parseNearAmount(localStorage.getItem("nftPrice"))
    });
    const gas = 200000000000000;
    const attachedDeposit = utils.format.parseNearAmount("0.1");
    const FunctionCallOptions = {
        contractId: configs.nakshContractWallet,
        methodName: 'nft_approve',
        args: {
            account_id: configs.nakshMarketWallet,
            token_id: nftDetails.token_id,
            msg
        },
        gas,
        attachedDeposit
    };
    
    localStorage.removeItem("nftPrice");
    localStorage.removeItem("paramsId");
    
    wallet.account().functionCall(FunctionCallOptions); // near redirection
  }

  this.nearStorage = async (nftPrice) => {

    const gas = 200000000000000;
    const attachedDeposit = utils.format.parseNearAmount("0.01");
    const FunctionCallOptions = {
        contractId: configs.nakshMarketWallet,
        methodName: 'storage_deposit',
        args: {},
        gas,
        attachedDeposit
    };
    
    localStorage.setItem("paramsId", paramsId);
    localStorage.setItem("primaryParamsId", paramsId);
    localStorage.setItem("nftPrice", nftPrice);

    wallet.account().functionCall(FunctionCallOptions); // near redirection 
  }

  this.updateNft = async (nftDetails, nftPrice) => {

    const gas = 200000000000000;
    const attachedDeposit = "1";
    const FunctionCallOptions = {
        contractId: configs.nakshMarketWallet,
        methodName: 'update_price',
        args: {
            nft_contract_id: configs.nakshContractWallet,
            token_id: nftDetails.token_id,
            price: utils.format.parseNearAmount(nftPrice)
        },
        gas,
        attachedDeposit
    };

    wallet.account().functionCall(FunctionCallOptions); // near redirection
  }
  // 6 perpetual_royalties
  // 20% total percentage

  this.mintNft = async (metadata, royalties, uid) => {

    const gas = 200000000000000;
    const attachedDeposit = utils.format.parseNearAmount("0.1");
    const perpetual_royalties = {
      "naksh.near": 500,
      ...royalties
    };

    const FunctionCallOptions = {
        contractId: configs.nakshContractWallet,
        methodName: 'nft_mint',
        args: {
          token_id: uid,
          metadata,
          perpetual_royalties
        },
        gas,
        attachedDeposit
    };

    wallet.account().functionCall(FunctionCallOptions); // near redirection

  }

}
  