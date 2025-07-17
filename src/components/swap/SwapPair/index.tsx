import { useUSDCValue } from "@/hooks/common/useUSDCValue";
import { IDerivedSwapInfo, useSwapActionHandlers, useSwapState } from "@/state/swapStore";
import { SwapField, SwapFieldType } from "@/types/swap-field";
import {
    computeCustomPoolAddress,
    Currency,
    CurrencyAmount,
    getTickToPrice,
    maxAmountSpend,
    Trade,
    TradeType,
    tryParseAmount,
    ZERO,
} from "@cryptoalgebra/custom-pools-sdk";
import { useCallback, useEffect, useMemo } from "react";
import TokenCard from "../TokenCard";
import { ChevronsUpDownIcon } from "lucide-react";
import useWrapCallback, { WrapType } from "@/hooks/swap/useWrapCallback";
import { SmartRouterTrade } from "@cryptoalgebra/router-custom-pools-and-sliding-fee";
import { CUSTOM_POOL_DEPLOYER_ADDRESSES, STABLECOINS } from "config";
import { usePool } from "@/hooks/pools/usePool";
import { useChainId } from "wagmi";
import { Address } from "viem";

const SwapPair = ({
    derivedSwap,
    trade,
    isTradeLoading,
}: {
    derivedSwap: IDerivedSwapInfo;
    trade: SmartRouterTrade<TradeType> | Trade<Currency, Currency, TradeType> | undefined;
    isTradeLoading: boolean | undefined;
}) => {
    const chainId = useChainId();

    const {
        independentField,
        typedValue,
        [SwapField.LIMIT_ORDER_PRICE]: limitOrderPrice,
        limitOrderPriceFocused,
        lastFocusedField,
        wasInverted,
    } = useSwapState();

    const { currencyBalances, parsedAmount, currencies } = derivedSwap;

    const baseCurrency = currencies[SwapField.INPUT];
    const quoteCurrency = currencies[SwapField.OUTPUT];

    const { wrapType } = useWrapCallback(currencies[SwapField.INPUT], currencies[SwapField.OUTPUT], typedValue);

    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;

    const limitOrderPoolAddress =
        baseCurrency && quoteCurrency && CUSTOM_POOL_DEPLOYER_ADDRESSES.ALL_INCLUSIVE[chainId] && !showWrap
            ? (computeCustomPoolAddress({
                  tokenA: baseCurrency.wrapped,
                  tokenB: quoteCurrency.wrapped,
                  customPoolDeployer: CUSTOM_POOL_DEPLOYER_ADDRESSES.ALL_INCLUSIVE[chainId],
              }) as Address)
            : undefined;

    const [, limitOrderPool] = usePool(limitOrderPoolAddress);

    const pairPrice = getTickToPrice(baseCurrency?.wrapped, quoteCurrency?.wrapped, limitOrderPool?.tickCurrent);

    const dependentField: SwapFieldType = independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT;

    const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();

    const handleInputSelect = useCallback(
        (inputCurrency: Currency) => {
            onCurrencySelection(SwapField.INPUT, inputCurrency);
        },
        [onCurrencySelection]
    );

    const handleOutputSelect = useCallback(
        (outputCurrency: Currency) => {
            onCurrencySelection(SwapField.OUTPUT, outputCurrency);
        },
        [onCurrencySelection]
    );

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(SwapField.INPUT, value);
        },
        [onUserInput]
    );
    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(SwapField.OUTPUT, value);
        },
        [onUserInput]
    );

    const { parsedLimitOrderInput, parsedLimitOrderOutput } = useMemo(() => {
        if (!limitOrderPrice || !parsedAmount || !quoteCurrency || !baseCurrency) return {};

        try {
            const parsedAmountNumber = parseFloat(parsedAmount.toExact());
            const limitPriceNumber = parseFloat(limitOrderPrice);

            if (independentField === SwapField.INPUT) {
                const outputAmount = !wasInverted ? parsedAmountNumber * limitPriceNumber : parsedAmountNumber / limitPriceNumber;
                return {
                    parsedLimitOrderInput: parsedAmount,
                    parsedLimitOrderOutput: tryParseAmount(outputAmount.toFixed(quoteCurrency.decimals), quoteCurrency),
                };
            } else {
                const inputAmount = !wasInverted ? parsedAmountNumber / limitPriceNumber : parsedAmountNumber * limitPriceNumber;

                return {
                    parsedLimitOrderInput: tryParseAmount(inputAmount.toFixed(baseCurrency.decimals), baseCurrency),
                    parsedLimitOrderOutput: parsedAmount,
                };
            }
        } catch (error) {
            console.error("Error calculating limit order amounts:", error);
            return {};
        }
    }, [limitOrderPrice, parsedAmount, quoteCurrency, baseCurrency, independentField, wasInverted]);

    const parsedAmounts = useMemo(() => {
        return showWrap
            ? {
                  [SwapField.INPUT]: parsedAmount,
                  [SwapField.OUTPUT]: parsedAmount,
              }
            : {
                  [SwapField.INPUT]:
                      independentField === SwapField.INPUT
                          ? parsedAmount
                          : pairPrice && limitOrderPrice
                            ? parsedLimitOrderInput
                            : trade?.inputAmount,
                  [SwapField.OUTPUT]:
                      independentField === SwapField.OUTPUT
                          ? limitOrderPrice
                              ? quoteCurrency && parsedAmount
                                  ? !limitOrderPriceFocused && lastFocusedField === SwapField.LIMIT_ORDER_PRICE
                                      ? parsedLimitOrderOutput
                                      : parsedAmount
                                  : undefined
                              : parsedAmount
                          : limitOrderPrice
                            ? quoteCurrency && parsedAmount
                                ? parsedLimitOrderOutput
                                : undefined
                            : trade?.outputAmount,
              };
    }, [
        showWrap,
        independentField,
        parsedAmount,
        limitOrderPrice,
        parsedLimitOrderInput,
        parsedLimitOrderOutput,
        trade,
        quoteCurrency,
        limitOrderPriceFocused,
        lastFocusedField,
    ]);

    const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[SwapField.INPUT]);
    const showMaxButton = Boolean(maxInputAmount?.greaterThan(0));

    const handleMaxInput = useCallback(() => {
        maxInputAmount && onUserInput(SwapField.INPUT, maxInputAmount.toExact());
    }, [maxInputAmount, onUserInput]);

    const { formatted: usdValueA } = useUSDCValue(parsedAmounts[SwapField.INPUT]);
    const { formatted: usdValueB } = useUSDCValue(parsedAmounts[SwapField.OUTPUT]);

    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]:
            showWrap && independentField !== SwapField.LIMIT_ORDER_PRICE
                ? (parsedAmounts[independentField]?.toExact() ?? "")
                : (parsedAmounts[dependentField]?.toExact() ?? ""),
    };

    const percentDifference = useMemo(() => {
        if (
            isTradeLoading ||
            !trade?.inputAmount.equalTo(parsedAmounts[SwapField.INPUT]?.quotient || ZERO) ||
            !trade?.outputAmount.equalTo(parsedAmounts[SwapField.OUTPUT]?.quotient || ZERO)
        )
            return;
        if (!usdValueA || !usdValueB) return 0;
        return ((usdValueB - usdValueA) / usdValueA) * 100;
    }, [isTradeLoading, trade?.inputAmount, trade?.outputAmount, parsedAmounts, usdValueA, usdValueB]);

    useEffect(() => {
        handleOutputSelect(STABLECOINS[chainId].USDC);
    }, [chainId, handleOutputSelect]);

    return (
        <div className="flex flex-col gap-1 relative">
            <TokenCard
                value={formattedAmounts[SwapField.INPUT]}
                currency={baseCurrency}
                otherCurrency={quoteCurrency}
                handleTokenSelection={handleInputSelect}
                handleValueChange={handleTypeInput}
                handleMaxValue={handleMaxInput}
                usdValue={usdValueA ?? undefined}
                showMaxButton={showMaxButton}
                showBalance={true}
                isLoading={independentField === SwapField.OUTPUT && isTradeLoading}
            />
            <button
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-card-dark w-fit rounded-full border-[5px] border-card hover:bg-card-hover duration-200"
                onClick={onSwitchTokens}
            >
                <ChevronsUpDownIcon size={16} />
            </button>
            <TokenCard
                value={formattedAmounts[SwapField.OUTPUT]}
                currency={quoteCurrency}
                otherCurrency={baseCurrency}
                handleTokenSelection={handleOutputSelect}
                handleValueChange={handleTypeOutput}
                usdValue={usdValueB ?? undefined}
                percentDifference={percentDifference}
                showBalance={true}
                isLoading={independentField === SwapField.INPUT && isTradeLoading}
            />
        </div>
    );
};

export default SwapPair;
