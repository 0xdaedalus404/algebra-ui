import { ADDRESS_ZERO, ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";

export type PoolDeployerType = "BASE" | "ALL_INCLUSIVE";

export const CUSTOM_POOL_DEPLOYER_ADDRESSES: Record<PoolDeployerType, Record<number, Address | undefined>> = {
    BASE: {
        [ChainId.SonicMainnet]: ADDRESS_ZERO,
    },
    /* Replace with `undefined` to use as a stub */
    ALL_INCLUSIVE: {
        [ChainId.SonicMainnet]: undefined,
    },
} as const;

export const CUSTOM_POOL_DEPLOYER_TITLES: Record<PoolDeployerType, string> = {
    BASE: "Base",
    ALL_INCLUSIVE: "All-inclusive",
} as const;

export const customPoolDeployerTitleByAddress: Record<Address, string> = Object.fromEntries(
    Object.entries(CUSTOM_POOL_DEPLOYER_ADDRESSES).flatMap(([key, chainMap]) =>
        Object.values(chainMap).map((address) => [
            address?.toLowerCase(),
            CUSTOM_POOL_DEPLOYER_TITLES[key as keyof typeof CUSTOM_POOL_DEPLOYER_TITLES],
        ])
    )
);
