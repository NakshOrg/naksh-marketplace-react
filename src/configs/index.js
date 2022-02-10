import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;

const isDevelopment = window.location.host === "localhost:3000";
const isStaging = window.location.host === "admindev.naksh.org";
const isProduction = window.location.host === "admin.naksh.org";

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
    nakshContractWallet: (isDevelopment || isStaging) ? 'nft1.abhishekvenunathan.testnet' : 'nft1.naksh.near' ,
    nakshMarketWallet: (isDevelopment || isStaging) ? 'market1.abhishekvenunathan.testnet' : 'market1.naksh.near',
    appUrl: isDevelopment ? "http://localhost:3000" :
    isStaging ? "http://marketdev.naksh.org" :
    "https://market.naksh.org",
    walletConfig: (isDevelopment || isStaging) ? testnetConfig : mainnetConfig,
    isProduction,
    isStaging,
    isDevelopment
}