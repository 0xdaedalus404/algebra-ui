import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";

export const ALGEBRA_FACTORY: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0x6e92291925907eFf19B41f3acC98523683830601",
};

export const QUOTER_V2: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0x2408B9A699fB58097d001581CBCa8A488DD5B63A",
};

export const SWAP_ROUTER: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0x08cDb93F8682b85B3a92284AB4b4f605f3BeA509",
};

export const NONFUNGIBLE_POSITION_MANAGER: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0x6980b324C7768a4ADeE71E424bAB7720875B6963",
};

export const ALGEBRA_ETERNAL_FARMING: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0xaA18645B7F8511573361e0E5Ea4a4c4dc5E0c29e",
};

export const FARMING_CENTER: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0xcD51e811c8c4836d7D08776B0a563144C806e8B2",
};

export const LIMIT_ORDER_MANAGER: Record<number, Address> = {
    [ChainId.SonicMainnet]: "0x0000000000000000000000000000000000000000",
};
