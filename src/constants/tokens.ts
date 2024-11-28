import { Token } from "@cryptoalgebra/custom-pools-sdk";
import { DEFAULT_CHAIN_ID } from "./default-chain-id";

export const STABLECOINS = {
    USDT: new Token(DEFAULT_CHAIN_ID, '0x2BF1004D9e80ca087BD1e089d75bc8c471995aC1', 6, 'USDT', 'USDT')
}