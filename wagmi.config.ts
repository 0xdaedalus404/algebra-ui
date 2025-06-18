import {
    ALGEBRA_ETERNAL_FARMING,
    ALGEBRA_FACTORY,
    ALGEBRA_LIMIT_ORDER_PLUGIN,
    ALGEBRA_POSITION_MANAGER,
    ALGEBRA_QUOTER,
    ALGEBRA_QUOTER_V2,
    ALGEBRA_ROUTER,
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
    DEFAULT_CHAIN_ID,
    FARMING_CENTER,
    farmingCenterABI,
    wNativeABI,
} from "./config";
import { ContractConfig, defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

const contracts: ContractConfig[] = [
    {
        address: ALGEBRA_FACTORY[DEFAULT_CHAIN_ID],
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
        address: ALGEBRA_POSITION_MANAGER[DEFAULT_CHAIN_ID],
        abi: algebraPositionManagerABI,
        name: "AlgebraPositionManager",
    },
    {
        address: ALGEBRA_QUOTER[DEFAULT_CHAIN_ID],
        abi: algebraQuoterABI,
        name: "AlgebraQuoter",
    },
    {
        address: ALGEBRA_QUOTER_V2[DEFAULT_CHAIN_ID],
        abi: algebraQuoterV2ABI,
        name: "AlgerbaQuoterV2",
    },
    {
        address: ALGEBRA_ROUTER[DEFAULT_CHAIN_ID],
        abi: algebraRouterABI,
        name: "AlgebraRouter",
    },
    {
        address: ALGEBRA_ETERNAL_FARMING[DEFAULT_CHAIN_ID],
        abi: algebraEternalFarmingABI,
        name: "AlgebraEternalFarming",
    },
    {
        address: FARMING_CENTER[DEFAULT_CHAIN_ID],
        abi: farmingCenterABI,
        name: "FarmingCenter",
    },
    {
        address: ALGEBRA_LIMIT_ORDER_PLUGIN[DEFAULT_CHAIN_ID],
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

export default defineConfig({
    out: "src/generated.ts",
    contracts,
    plugins: [react(), actions()],
});
