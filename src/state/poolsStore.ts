import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { CUSTOM_POOL_BASE, CUSTOM_POOL_DEPLOYER_ALM, CUSTOM_POOL_DEPLOYER_LIMIT_ORDER } from "config/contract-addresses";
import { Address } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const customPoolDeployerTitles = {
    [CUSTOM_POOL_BASE[ChainId.Base]]: "Base",
    [CUSTOM_POOL_BASE[ChainId.BaseSepolia]]: "Base",

    [CUSTOM_POOL_DEPLOYER_LIMIT_ORDER[ChainId.Base]]: "Limit Order",
    [CUSTOM_POOL_DEPLOYER_LIMIT_ORDER[ChainId.BaseSepolia]]: "Limit Order",

    [CUSTOM_POOL_DEPLOYER_ALM[ChainId.Base]]: "ALM",
    [CUSTOM_POOL_DEPLOYER_ALM[ChainId.BaseSepolia]]: "ALM",
};

interface PoolPlugins {
    dynamicFeePlugin: boolean;
    limitOrderPlugin: boolean;
    farmingPlugin: boolean;
}

interface PoolsState {
    readonly pluginsForPools: { [key: Address]: PoolPlugins };
    setPluginsForPool: (poolId: Address, plugins: PoolPlugins) => void;
}

export const usePoolsStore = create(
    persist<PoolsState>(
        (set, get) => ({
            pluginsForPools: {},
            setPluginsForPool: (poolId: Address, plugins: PoolPlugins) =>
                set({
                    pluginsForPools: {
                        ...get().pluginsForPools,
                        [poolId.toLowerCase()]: plugins,
                    },
                }),
        }),
        {
            name: "pools-plugins",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
