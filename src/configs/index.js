import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;

const isDevelopment = window.location.host === "localhost:3000";
const isStaging = window.location.host === "marketdev.naksh.org";
const isProduction = window.location.host === "naksh.org";

const testnetConfig = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org"
}

const mainnetConfig = {
    networkId: "mainnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.mainnet.near.org/",
    walletUrl: "https://wallet.mainnet.near.org/",
    helperUrl: "https://helper.mainnet.near.org/",
    explorerUrl: "https://explorer.mainnet.near.org/",
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    baseURL: (isDevelopment || isStaging) ? 'http://apidev.naksh.org/admin' : 'https://api.naksh.org/admin',
    clientBaseURL: (isDevelopment || isStaging) ? 'http://apidev.naksh.org/client' : 'https://api.naksh.org/client',
    nakshContractWallet: (isDevelopment || isStaging) ? 'nft1.abhishekvenunathan.testnet' : 'nft1.naksh.near' ,
    nakshMarketWallet: (isDevelopment || isStaging) ? 'market1.abhishekvenunathan.testnet' : 'market1.naksh.near',
    appUrl: isDevelopment ? "http://localhost:3000" :
    isStaging ? "http://marketdev.naksh.org" :
    "https://naksh.org",
    walletConfig: (isDevelopment || isStaging) ? testnetConfig : mainnetConfig,
    isProduction,
    isStaging,
    isDevelopment,
    discord: "https://discord.gg/FEuh4bxcfx",
    telegram: "https://t.me/nakshofficial",
    instagram: "https://www.instagram.com/nakshmarketplace/",
    linkedin: "https://www.linkedin.com/company/naksh-marketplace/",
    twitter: "https://twitter.com/NakshMarket",
    faq: "https://coda.io/d/_dsFX-mE7jjm/Naksh-Help-Center_sulr9#_luyT4",
    familiarWithNaksh: "https://coda.io/d/_dsFX-mE7jjm/Naksh-Help-Center_sulr9#_luznI",
    nakshFunctioning: "https://coda.io/d/_dsFX-mE7jjm/Naksh-Help-Center_sulr9#_lusLk",
    existingUsers: "https://coda.io/d/_dsFX-mE7jjm/Naksh-Help-Center_sulr9#_lu4ng",
    nftOwners: "https://coda.io/d/_dsFX-mE7jjm/Naksh-Help-Center_sulr9#_luUoZ",
    nearWebsite: "Near.org",
    nakshMedium: "https://medium.com/@naksh.org"
}