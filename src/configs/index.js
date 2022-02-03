import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    baseURL: 'http://apidev.naksh.org/admin',
    appUrl: process.env.NODE_ENV === 'development' ? "http://localhost:3000" : "http://marketdev.naksh.org/",
    nakshContractWallet: 'nft1.abhishekvenunathan.testnet',
    nakshMarketWallet: 'market1.abhishekvenunathan.testnet',
    walletConfig: {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    }    
}