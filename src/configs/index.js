import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    baseURL: 'https://api.naksh.org',
    appUrl: process.env.NODE_ENV === 'development' ? "http://localhost:3000" : "http://admindev.naksh.org",
    walletConfig: {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    }    
}