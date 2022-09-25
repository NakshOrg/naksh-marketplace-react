export const NFT_DATA_QUERY = `
query B($id: [String!]!) {
    nftdatas(where:{id_in:$id}) {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
}
`

export const GET_SINGLE_NFT = `
query GetSingleNft($tokenId: String!, $nftAddress: String!) {
    nftdatas(where:{tokenId:$tokenId, nftAddress:$nftAddress}) {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
}
`


export const GET_COLLECTION_NFTS = `
query GetSingleNft($nftAddress: String!) {
    nftdatas(where:{nftAddress:$nftAddress}) {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
}
`

export const GET_USER_COLLECTION = `
query GetUserCollection($creator: String!) {
  collections(where:{creator:$creator}) {
    id
    name
    symbol
    nftAddress
    creator
  }
}
`

export const GET_NFT_ON_SALE = `
query getNftonSale {
  saleDatas {
    id
    isOnSale
    nft {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
    auction {
      id
      startTime
      endTime
      tokenId
      price
      nft {
        id
      }
      owner
      highestBid
      highestBidder
      bids {
        id
        bidder
        amount
        timestamp
      }
    }
    tokenFirstSale
    salePrice
    saleType
  }
}
`

export const AUCTIONED_NFTS = `
{
  nftauctions(first: 5) {
    id
    startTime
    endTime
    tokenId
    price
    nft {
      id
    }
    owner
    highestBid
    highestBidder
    bids {
      id
      bidder
      amount
      timestamp
    }
  }
}
`

export const MY_NFTS = `
query A($address: String!) {
  nftdatas(where:{creator: $address}) {
    id
    nftAddress
    tokenId
    tokenUri
    title
    description
    artistImg
    artistName
    creator
    minter
  }
}
`

export const SOLD_NFTS = `
query B{
  soldNFTs {
    id,
    buyer
    seller
    price
    nft {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
    timestamp
  }
}
`

export const A_SOLD_NFT = `
query B($nftId: String!) {
  soldNFTs(where: {nft:$nftId}) {
    id,
    buyer
    seller
    price
    nft {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
    timestamp
  }
}
`

export const COLLECTION_SOLD_NFTS = `
query B($address: String!) {
  soldNFTs(where: {nft_starts_with:$address}) {
    id,
    buyer
    seller
    price
    nft {
      id
      nftAddress
      tokenId
      tokenUri
      title
      description
      artistImg
      artistName
      creator
      minter
    }
    timestamp
  }
}
`