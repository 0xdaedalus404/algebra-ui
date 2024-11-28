import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import './styles/_colors.css'
import './App.css'

import { WagmiConfig } from 'wagmi'
import Layout from "@/components/common/Layout"
import { defineChain } from "viem"

import KakarotLogo from '@/assets/kakarot-logo.png'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const kakarotChain = defineChain({
  id: 920637907288165,
  network: 'kakarot-sepolia',
  name: 'Kakarot',
  nativeCurrency: { name: 'Kakarot Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_INFURA_RPC],
    },
    public: {
      http: [import.meta.env.VITE_INFURA_RPC],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Kakarotscan',
      url: 'https://sepolia.kakarotscan.org',
    },
    default: {
      name: 'Kakarotscan',
      url: 'https://sepolia.kakarotscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0x6d63b39017f379bfd0301293022581c6ef237a19',
      blockCreated: 348826,
    },
  },
  testnet: true,
})

const chains = [kakarotChain]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata: { name: 'Daikon DEX', description: 'Daikon DEX app', url: 'https://app.daikon.finance', icons: [''] } })

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains, 
  chainImages: {
    920637907288165: KakarotLogo
  },
  defaultChain: kakarotChain,
  themeVariables: {
    '--w3m-accent': '#ff8a34'
  },
  themeMode: 'light'
})

function App({ children }: { children: React.ReactNode }) {

  return (
    <WagmiConfig config={wagmiConfig}>
        <Layout>
          {children}
        </Layout>
    </WagmiConfig>
  )
}

export default App
