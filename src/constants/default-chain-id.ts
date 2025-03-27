import { ChainId } from "@cryptoalgebra/custom-pools-sdk";

export const DEFAULT_CHAIN_NAME = {
    [ChainId.Base]: "Base",
    [ChainId.BaseSepolia]: "Base Sepolia",
};
export const DEFAULT_NATIVE_SYMBOL = {
    [ChainId.Base]: "ETH",
    [ChainId.BaseSepolia]: "ETH",
};
export const DEFAULT_NATIVE_NAME = {
    [ChainId.Base]: "Ether",
    [ChainId.BaseSepolia]: "Ether",
};
