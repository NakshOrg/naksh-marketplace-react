import configs from '../../configs';


export default function NearHelperFunctions(wallet, paramsId) {

  this.getAllListedNfts = async (allNfts) => {
    
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

    const filteredNfts = [];

    allNfts.map(nftItem => {
      const listedItem = res.find(t => t.token_id === nftItem.token_id);
      if(listedItem) {
        nftItem["listed"] = true;
        nftItem["price"] = `${listedItem.sale_conditions}N`;
        filteredNfts.push(nftItem);
      }
    });

    return filteredNfts;
  }

  this.getAllNfts = async () => {

    const res = await wallet.account()
    .viewFunction(
      configs.nakshContractWallet, 
      'nft_tokens', 
      { 
        from_index: "0", 
        limit: 1000 
      }
    );

    const nftsWithPrice = await this.getAllListedNfts(res); // to get nft price

    return nftsWithPrice;

  };

}
  