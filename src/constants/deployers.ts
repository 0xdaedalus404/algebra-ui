import { CUSTOM_POOL_DEPLOYER_LIMIT_ORDER, CUSTOM_POOL_BASE } from "@/constants/addresses.ts";
import { ChainId } from "@cryptoalgebra/custom-pools-sdk";

export const customPoolDeployerTitles = {
    [CUSTOM_POOL_BASE[ChainId.Base]]: "Base",
    [CUSTOM_POOL_DEPLOYER_LIMIT_ORDER[ChainId.Base]]: "Limit Order",
};
