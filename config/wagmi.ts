import { ContractConfig } from "@wagmi/cli";
import { AppKitNetwork, base, baseSepolia } from "@reown/appkit/networks";
import {
    algebraBasePluginABI,
    algebraCustomPoolDeployerABI,
    algebraEternalFarmingABI,
    algebraFactoryABI,
    algebraLimitOrderPluginABI,
    algebraPoolABI,
    algebraPositionManagerABI,
    algebraQuoterABI,
    algebraQuoterV2ABI,
    algebraRouterABI,
    farmingCenterABI,
    wNativeABI,
} from "./abis";

export const wagmiNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia, base];

export const wagmiContracts: ContractConfig[] = [
    {
        abi: algebraFactoryABI,
        name: "AlgebraFactory",
    },
    {
        abi: algebraPoolABI,
        name: "AlgebraPool",
    },
    {
        abi: algebraBasePluginABI,
        name: "AlgebraBasePlugin",
    },
    {
        abi: algebraPositionManagerABI,
        name: "AlgebraPositionManager",
    },
    {
        abi: algebraQuoterABI,
        name: "AlgebraQuoter",
    },
    {
        abi: algebraQuoterV2ABI,
        name: "AlgerbaQuoterV2",
    },
    {
        abi: algebraRouterABI,
        name: "AlgebraRouter",
    },
    {
        abi: algebraEternalFarmingABI,
        name: "AlgebraEternalFarming",
    },
    {
        abi: farmingCenterABI,
        name: "FarmingCenter",
    },
    {
        abi: algebraLimitOrderPluginABI,
        name: "AlgebraLimitOrderPlugin",
    },
    {
        abi: algebraCustomPoolDeployerABI,
        name: "AlgebraCustomPoolDeployer",
    },
    {
        abi: wNativeABI,
        name: "WrappedNative",
    },
];
