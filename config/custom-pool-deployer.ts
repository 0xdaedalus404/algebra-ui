import { ADDRESS_ZERO, ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";

export type PoolDeployerType = "BASE" | "LIMIT_ORDER" | "ALM";

export const CUSTOM_POOL_DEPLOYER_ADDRESSES: Record<PoolDeployerType, Record<number, Address>> = {
    BASE: {
        [ChainId.Base]: ADDRESS_ZERO,
        [ChainId.BaseSepolia]: ADDRESS_ZERO,
    },
    LIMIT_ORDER: {
        [ChainId.Base]: "0xf3b57fe4d5d0927c3a5e549cb6af1866687e2d62",
        [ChainId.BaseSepolia]: "0x9089f3440c8e7534afcfec2b731c4d6b78876308",
    },
    ALM: {
        [ChainId.Base]: ADDRESS_ZERO,
        [ChainId.BaseSepolia]: ADDRESS_ZERO,
    },
};

export const CUSTOM_POOL_DEPLOYER_TITLES: Record<PoolDeployerType, string> = {
    BASE: "Base",
    LIMIT_ORDER: "Limit Order",
    ALM: "ALM",
} as const;

export const customPoolDeployerTitleByAddress: Record<Address, string> = Object.fromEntries(
    Object.entries(CUSTOM_POOL_DEPLOYER_ADDRESSES).flatMap(([key, chainMap]) =>
        Object.values(chainMap).map((address) => [
            address.toLowerCase(),
            CUSTOM_POOL_DEPLOYER_TITLES[key as keyof typeof CUSTOM_POOL_DEPLOYER_TITLES],
        ])
    )
);
