import { STABLECOINS, USE_UNISWAP_PLACEHOLDER_DATA } from "config";
import { useNativePriceQuery, useSingleTokenQuery } from "@/graphql/generated/graphql";
import { Currency, CurrencyAmount, Price, tryParseAmount } from "@cryptoalgebra/custom-pools-sdk";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useClients } from "../graphql/useClients";
import { useUniswapSingleTokenQuery } from "../analytics/uniswap/useUniswapSingleTokenQuery";
import { useUniswapNativePriceQuery } from "../analytics/uniswap/useUniswapNativePriceQuery";

export function useUSDCPrice(currency: Currency | undefined) {
    const { infoClient } = useClients();
    const chainId = useChainId();

    const { data: bundles } = useNativePriceQuery({
        client: infoClient,
        skip: USE_UNISWAP_PLACEHOLDER_DATA,
    });

    const { data: token } = useSingleTokenQuery({
        variables: {
            tokenId: currency ? currency.wrapped.address.toLowerCase() : "",
        },
        client: infoClient,
    });

    /* removable (placeholder data) */
    const { data: uniswapBundles } = useUniswapNativePriceQuery({
        skip: !USE_UNISWAP_PLACEHOLDER_DATA,
    });

    /* removable (placeholder data) */
    const { data: uniswapToken } = useUniswapSingleTokenQuery({
        variables: {
            tokenId: currency ? currency.wrapped.address.toLowerCase() : "",
        },
        skip: !USE_UNISWAP_PLACEHOLDER_DATA,
    });

    return useMemo(() => {
        if (!currency) {
            return {
                price: undefined,
                formatted: 0,
            };
        }

        // USDC itself — 1:1 price
        if (STABLECOINS[chainId].USDC.address.toLowerCase() === currency.wrapped.address.toLowerCase()) {
            return {
                price: new Price(STABLECOINS[chainId].USDC, STABLECOINS[chainId].USDC, "1", "1"),
                formatted: 1,
            };
        }

        let derivedMatic: string | undefined;
        let maticPriceUSD: number | undefined;

        if (USE_UNISWAP_PLACEHOLDER_DATA && uniswapBundles?.data.bundles?.[0] && uniswapToken?.data.token?.derivedNative) {
            derivedMatic = uniswapToken.data.token.derivedNative;
            maticPriceUSD = uniswapBundles?.data.bundles[0].nativePriceUSD;
        } else if (!USE_UNISWAP_PLACEHOLDER_DATA && bundles?.bundles?.[0] && token?.token?.derivedMatic) {
            maticPriceUSD = Number(bundles.bundles[0].maticPriceUSD);
            derivedMatic = token.token.derivedMatic;
        } else {
            return {
                price: undefined,
                formatted: 0,
            };
        }

        if (!derivedMatic || !maticPriceUSD) {
            return {
                price: undefined,
                formatted: 0,
            };
        }

        const tokenUSDValue = Number(derivedMatic) * maticPriceUSD;

        const usdAmount = tryParseAmount(tokenUSDValue.toFixed(currency.decimals), currency);

        if (usdAmount) {
            return {
                price: new Price(currency, STABLECOINS[chainId].USDC, usdAmount.denominator, usdAmount.numerator),
                formatted: Number(usdAmount.toSignificant()),
            };
        }

        return {
            price: undefined,
            formatted: 0,
        };
    }, [
        currency,
        bundles?.bundles,
        chainId,
        token?.token?.derivedMatic,
        uniswapToken?.data.token.derivedNative,
        uniswapBundles?.data.bundles,
    ]);
}

export function useUSDCValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
    const { price, formatted } = useUSDCPrice(currencyAmount?.currency);

    return useMemo(() => {
        if (!price || !currencyAmount)
            return {
                price: null,
                formatted: null,
            };

        try {
            return {
                price: price.quote(currencyAmount),
                formatted: Number(currencyAmount.toSignificant()) * formatted,
            };
        } catch {
            return {
                price: null,
                formatted: null,
            };
        }
    }, [currencyAmount, price]);
}
