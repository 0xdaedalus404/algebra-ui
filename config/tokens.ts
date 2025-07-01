import { ChainId, Token } from "@cryptoalgebra/custom-pools-sdk";

export const STABLECOINS = {
    [ChainId.BaseSepolia]: {
        USDC: new Token(ChainId.BaseSepolia, "0xAbAc6f23fdf1313FC2E9C9244f666157CcD32990", 6, "USDC", "USDC"),
    },
};
