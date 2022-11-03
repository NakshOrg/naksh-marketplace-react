import '@rainbow-me/rainbowkit/styles.css';

import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
    [chain.polygon],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'Naksh',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const ConnectWalletContext = ({ children }) => {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider theme={darkTheme()} chains={chains}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default ConnectWalletContext