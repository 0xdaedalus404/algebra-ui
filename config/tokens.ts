import { ChainId, Token } from "@cryptoalgebra/custom-pools-sdk";

export const STABLECOINS = {
    [ChainId.SonicMainnet]: {
        USDC: new Token(ChainId.SonicMainnet, "0x29219dd400f2Bf60E5a23d13Be72B486D4038894", 6, "USDC", "USDC"),
    },
};
