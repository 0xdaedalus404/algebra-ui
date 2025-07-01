import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";

export const ALGEBRA_FACTORY: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0xcD58521ecaC7724d1752F941C56490c27bAe9ab0",
};

export const QUOTER_V2: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0x1c219ba68A9100E4F3475A624cf225ADA02c0F1B",
};

export const SWAP_ROUTER: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0x3400D4f83c528A0E19c380d92DD100eA51d8980c",
};

export const NONFUNGIBLE_POSITION_MANAGER: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0x5baD56bfBABEC1A5A7848399762f54566FA22557",
};

export const ALGEBRA_ETERNAL_FARMING: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0x1C5E8C41B5B119dc8fc5ac8e53692E323a6D78D7",
};

export const FARMING_CENTER: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0x4Ce15380bA2573954e67298209B8DF84222bc62E",
};

export const LIMIT_ORDER_MANAGER: Record<number, Address> = {
    [ChainId.BaseSepolia]: "0x05F9E353559da6f2Bfe9A0980D5C3e84eA5d4238",
};
