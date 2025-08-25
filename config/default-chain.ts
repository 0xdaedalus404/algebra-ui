import { ChainId } from "@cryptoalgebra/custom-pools-sdk";

export const CHAIN_NAME = {
    [ChainId.SonicMainnet]: "Sonic Mainnet",
};

export const NATIVE_SYMBOL = {
    [ChainId.SonicMainnet]: "S",
};

export const NATIVE_NAME = {
    [ChainId.SonicMainnet]: "Sonic",
};

export const CHAIN_ID = {
    [ChainId.SonicMainnet]: ChainId.SonicMainnet,
};

export const DEFAULT_CHAIN_ID = ChainId.SonicMainnet;
export const DEFAULT_CHAIN_NAME = CHAIN_NAME[DEFAULT_CHAIN_ID];
export const DEFAULT_NATIVE_SYMBOL = NATIVE_SYMBOL[DEFAULT_CHAIN_ID];
export const DEFAULT_NATIVE_NAME = NATIVE_NAME[DEFAULT_CHAIN_ID];
