import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import "./styles/_colors.css";
import "./App.css";

import { WagmiConfig } from "wagmi";
import Layout from "@/components/common/Layout";

import BaseLogo from "@/assets/base-logo.jpg";
import { base } from "viem/chains";
import { defineChain } from "viem";

const baseSepolia = /*#__PURE__*/ defineChain({
    id: 84532,
    network: "baseSepolia",
    name: "Base Sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://base-sepolia-rpc.publicnode.com"],
        },
        public: {
            http: ["https://base-sepolia-rpc.publicnode.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "Basescan",
            url: "https://sepolia.basescan.org",
        },
        etherscan: {
            name: "Basescan",
            url: "https://sepolia.basescan.org",
        },
    },
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11",
            blockCreated: 1059647,
        },
    },
});

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const chains = [base, baseSepolia];
const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata: { name: "CLAMM DEX", description: "CLAMM DEX app", url: "https://app.clamm.io", icons: [""] },
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    chainImages: {
        8453: BaseLogo,
        84532: BaseLogo,
    },
    defaultChain: base,
    themeVariables: {
        "--w3m-accent": "#ff8a34",
    },
    themeMode: "light",
});

function App({ children }: { children: React.ReactNode }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <Layout>{children}</Layout>
        </WagmiConfig>
    );
}

export default App;
