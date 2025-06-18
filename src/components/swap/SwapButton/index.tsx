import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { DEFAULT_CHAIN_NAME } from "config";
import { useApproveCallbackFromSmartTrade } from "@/hooks/common/useApprove";
import useWrapCallback, { WrapType } from "@/hooks/swap/useWrapCallback";
import { IDerivedSwapInfo, useSwapState } from "@/state/swapStore";
import { useUserState } from "@/state/userStore";
import { ApprovalState } from "@/types/approve-state";
import { SwapField } from "@/types/swap-field";
import { warningSeverity } from "@/utils/swap/prices";
import { useCallback, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { SmartRouter, SmartRouterTrade } from "@cryptoalgebra/router-custom-pools-and-sliding-fee";
import { ChainId, TradeType, tryParseAmount } from "@cryptoalgebra/custom-pools-sdk";
import { useSmartRouterCallback } from "@/hooks/routing/useSmartRouterCallback.ts";
import { Address } from "viem";
import { useAppKit } from "@reown/appkit/react";

const SwapButton = ({
    derivedSwap,
    smartTrade,
    isSmartTradeLoading,
    callOptions,
}: {
    derivedSwap: IDerivedSwapInfo;
    smartTrade: SmartRouterTrade<TradeType> | undefined;
    isSmartTradeLoading: boolean;
    callOptions: { calldata: Address | undefined; value: Address | undefined };
}) => {
    const { open } = useAppKit();

    const selectedNetworkId = useChainId();

    const { address: account } = useAccount();

    const { isExpertMode } = useUserState();

    const { independentField, typedValue } = useSwapState();
    const { allowedSlippage, parsedAmount, currencies, inputError: swapInputError, currencyBalances } = derivedSwap;

    const {
        wrapType,
        execute: onWrap,
        loading: isWrapLoading,
        inputError: wrapInputError,
    } = useWrapCallback(currencies[SwapField.INPUT], currencies[SwapField.OUTPUT], typedValue);

    const showWrap = wrapType !== WrapType.NOT_APPLICABLE;

    const parsedAmountA =
        independentField === SwapField.INPUT
            ? parsedAmount
            : tryParseAmount(smartTrade?.inputAmount?.toSignificant(), smartTrade?.inputAmount?.currency);

    const parsedAmountB =
        independentField === SwapField.OUTPUT
            ? parsedAmount
            : tryParseAmount(smartTrade?.outputAmount?.toSignificant(), smartTrade?.outputAmount?.currency);

    const parsedAmounts = useMemo(
        () => ({
            [SwapField.INPUT]: parsedAmountA,
            [SwapField.OUTPUT]: parsedAmountB,
        }),
        [parsedAmountA, parsedAmountB]
    );

    const userHasSpecifiedInputOutput = Boolean(
        currencies[SwapField.INPUT] &&
            currencies[SwapField.OUTPUT] &&
            independentField !== SwapField.LIMIT_ORDER_PRICE &&
            parsedAmounts[independentField]?.greaterThan("0")
    );

    const isLoadingRoute = isSmartTradeLoading;
    const routeNotFound = !smartTrade;
    const insufficientBalance =
        currencyBalances[SwapField.INPUT] &&
        smartTrade?.inputAmount &&
        currencyBalances[SwapField.INPUT]?.lessThan(smartTrade.inputAmount.quotient.toString());

    const { approvalState, approvalCallback } = useApproveCallbackFromSmartTrade(smartTrade, allowedSlippage);

    const priceImpact = useMemo(() => {
        if (!smartTrade) return undefined;
        return SmartRouter.getPriceImpact(smartTrade);
    }, [smartTrade]);

    const priceImpactSeverity = useMemo(() => {
        if (!priceImpact) return 0;
        return warningSeverity(priceImpact);
    }, [priceImpact]);

    const showApproveFlow =
        !swapInputError &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
        !(priceImpactSeverity > 3 && !isExpertMode);

    const swapCallback = useSmartRouterCallback(
        smartTrade?.inputAmount?.currency,
        smartTrade?.outputAmount?.currency,
        smartTrade?.inputAmount?.toFixed(),
        callOptions.calldata,
        callOptions.value
    );

    const { callback, isLoading: isSwapLoading } = swapCallback;

    const handleSwap = useCallback(async () => {
        if (!callback) return;
        try {
            await callback();
        } catch (error) {
            return new Error(`Swap Failed ${error}`);
        }
    }, [callback]);

    const isValid = !swapInputError;

    const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;

    const isWrongChain = !selectedNetworkId || ![ChainId.Base, ChainId.BaseSepolia].includes(selectedNetworkId);

    if (!account) return <Button onClick={() => open()}>Connect Wallet</Button>;

    if (isWrongChain)
        return <Button variant={"destructive"} onClick={() => open({ view: "Networks" })}>{`Connect to ${DEFAULT_CHAIN_NAME}`}</Button>;

    if (showWrap && wrapInputError) return <Button disabled>{wrapInputError}</Button>;

    if (showWrap)
        return (
            <Button onClick={() => onWrap && onWrap()}>
                {isWrapLoading ? <Loader /> : wrapType === WrapType.WRAP ? "Wrap" : "Unwrap"}
            </Button>
        );

    if (routeNotFound && userHasSpecifiedInputOutput)
        return <Button disabled>{isLoadingRoute ? <Loader /> : "Insufficient liquidity for this trade."}</Button>;

    if (smartTrade && insufficientBalance) {
        return <Button>{isLoadingRoute ? <Loader /> : `Insufficient ${smartTrade.inputAmount.currency.symbol} amount`}</Button>;
    }

    if (showApproveFlow)
        return (
            <Button disabled={approvalState !== ApprovalState.NOT_APPROVED} onClick={() => approvalCallback && approvalCallback()}>
                {approvalState === ApprovalState.PENDING ? (
                    <Loader />
                ) : approvalState === ApprovalState.APPROVED ? (
                    "Approved"
                ) : (
                    `Approve ${currencies[SwapField.INPUT]?.symbol}`
                )}
            </Button>
        );

    return (
        <>
            <Button onClick={() => handleSwap()} disabled={!isValid || priceImpactTooHigh || isSwapLoading || isLoadingRoute}>
                {isSwapLoading ? (
                    <Loader />
                ) : swapInputError ? (
                    swapInputError
                ) : priceImpactTooHigh ? (
                    "Price Impact Too High"
                ) : priceImpactSeverity > 2 ? (
                    "Swap Anyway"
                ) : (
                    "Swap"
                )}
            </Button>
        </>
    );
};

export default SwapButton;
