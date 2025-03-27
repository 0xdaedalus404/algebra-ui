import { Address, useChainId } from "wagmi";
import { Currency, ExtendedNative, WNATIVE } from "@cryptoalgebra/custom-pools-sdk";
import { ADDRESS_ZERO } from "@cryptoalgebra/custom-pools-sdk";
import { DEFAULT_NATIVE_NAME, DEFAULT_NATIVE_SYMBOL } from "@/constants/default-chain-id";
import { useAlgebraToken } from "./useAlgebraToken";

export function useCurrency(address: Address | undefined, withNative?: boolean): Currency | ExtendedNative | undefined {
    const chainId = useChainId();
    const isWNative = address?.toLowerCase() === WNATIVE[chainId].address.toLowerCase();

    const isNative = address === ADDRESS_ZERO;

    const token = useAlgebraToken(isNative || isWNative ? ADDRESS_ZERO : address, chainId);

    const extendedEther = ExtendedNative.onChain(chainId, DEFAULT_NATIVE_SYMBOL[chainId], DEFAULT_NATIVE_NAME[chainId]);

    if (withNative) return isNative || isWNative ? extendedEther : token;

    if (isWNative) return extendedEther.wrapped;

    return isNative ? extendedEther : token;
}
