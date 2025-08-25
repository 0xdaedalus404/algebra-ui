import { ContractConfig } from "@wagmi/cli";
import { AppKitNetwork } from "@reown/appkit/networks";
import {
    algebraBasePluginV1ABI,
    algebraCustomPoolEntryPointABI,
    algebraEternalFarmingABI,
    algebraFactoryABI,
    algebraPoolABI,
    farmingCenterABI,
    limitOrderManagerABI,
    nonfungiblePositionManagerABI,
    quoterV2ABI,
    swapRouterABI,
    wNativeABI,
} from "./abis";
import {
    ALGEBRA_ETERNAL_FARMING,
    ALGEBRA_FACTORY,
    FARMING_CENTER,
    LIMIT_ORDER_MANAGER,
    NONFUNGIBLE_POSITION_MANAGER,
    QUOTER_V2,
    SWAP_ROUTER,
} from "./contract-addresses";
import { defineChain } from "viem";
import { algebraVirtualPoolABI } from "./abis/farming/algebraVirtualPool";

const sonicChain = /*#__PURE__*/ defineChain({
    id: 146,
    network: "sonic",
    name: "Sonic Mainnet",
    nativeCurrency: { name: "Sonic", symbol: "S", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://go.getblock.io/f0ef645128ca4adba22ed615f524640a"],
        },
        public: {
            http: ["https://sonic.therpc.io"],
        },
    },
    blockExplorers: {
        default: {
            name: "SonicScan",
            url: "https://sonicscan.org",
        },
        etherscan: {
            name: "SonicScan",
            url: "https://sonicscan.org",
        },
    },
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11", // Standard multicall3 address
            blockCreated: 1,
        },
    },
});

/* configure supported networks here */
export const wagmiNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [sonicChain];

const rawContracts = [
    { name: "AlgebraFactory", abi: algebraFactoryABI },
    { name: "AlgebraPool", abi: algebraPoolABI },
    { name: "AlgebraBasePluginV1", abi: algebraBasePluginV1ABI },
    { name: "NonfungiblePositionManager", abi: nonfungiblePositionManagerABI },
    { name: "QuoterV2", abi: quoterV2ABI },
    { name: "SwapRouter", abi: swapRouterABI },
    { name: "AlgebraEternalFarming", abi: algebraEternalFarmingABI },
    { name: "FarmingCenter", abi: farmingCenterABI },
    { name: "AlgebraVirtualPool", abi: algebraVirtualPoolABI },
    { name: "LimitOrderManager", abi: limitOrderManagerABI },
    { name: "AlgebraCustomPoolEntryPoint", abi: algebraCustomPoolEntryPointABI },
    { name: "WrappedNative", abi: wNativeABI },
];

const contractAddreses = {
    AlgebraFactory: ALGEBRA_FACTORY,
    NonfungiblePositionManager: NONFUNGIBLE_POSITION_MANAGER,
    QuoterV2: QUOTER_V2,
    SwapRouter: SWAP_ROUTER,
    AlgebraEternalFarming: ALGEBRA_ETERNAL_FARMING,
    FarmingCenter: FARMING_CENTER,
    LimitOrderManager: LIMIT_ORDER_MANAGER,
};

export const wagmiContracts: ContractConfig[] = rawContracts.map((contract) => ({
    name: contract.name,
    abi: contract.abi,
    address: contractAddreses[contract.name as keyof typeof contractAddreses],
}));
