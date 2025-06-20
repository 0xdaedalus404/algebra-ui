import { formatBalance } from "@/utils/common/formatBalance";
import { Currency, Percent, Trade, TradeType } from "@cryptoalgebra/custom-pools-sdk";
import { useAccount, useChainId } from "wagmi";
import { useSwapCallArguments } from "./useSwapCallArguments";
import { useEffect, useMemo, useState } from "react";
import { SwapCallbackState } from "@/types/swap-state";
import { useTransactionAwait } from "../common/useTransactionAwait";
import { ApprovalStateType } from "@/types/approve-state";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { Address } from "viem";
import { simulateAlgebraRouterMulticall, useWriteAlgebraRouterMulticall } from "@/generated";
import { wagmiConfig } from "@/providers/WagmiProvider";
import { ALGEBRA_ROUTER } from "config/contract-addresses";

interface SwapCallEstimate {
    calldata: string;
    value: bigint;
}

interface SuccessfulCall extends SwapCallEstimate {
    calldata: string;
    value: bigint;
    gasEstimate: bigint;
}

interface FailedCall extends SwapCallEstimate {
    calldata: string;
    value: bigint;
    error: Error;
}

export function useSwapCallback(
    trade: Trade<Currency, Currency, TradeType> | undefined,
    allowedSlippage: Percent,
    approvalState: ApprovalStateType
) {
    const { address: account } = useAccount();
    const chainId = useChainId();

    const [bestCall, setBestCall] = useState<any>();

    const swapCalldata = useSwapCallArguments(trade, allowedSlippage);

    useEffect(() => {
        async function findBestCall() {
            if (!swapCalldata || !account) return;

            setBestCall(undefined);

            const calls = await Promise.all(
                swapCalldata.map(async ({ calldata, value: _value }) => {
                    const value = BigInt(_value);

                    try {
                        const result = await simulateAlgebraRouterMulticall(wagmiConfig, {
                            address: ALGEBRA_ROUTER[chainId],
                            args: [calldata],
                            account,
                            value,
                        });

                        return {
                            calldata,
                            value,
                            gasEstimate: result.request.gas,
                        };
                    } catch (error) {
                        return {
                            calldata,
                            value,
                            error: error as Error,
                        };
                    }
                })
            );

            let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = calls.find(
                (el, ix, list): el is SuccessfulCall => "gasEstimate" in el && (ix === list.length - 1 || "gasEstimate" in list[ix + 1])
            );

            if (!bestCallOption) {
                const errorCalls = calls.filter((call): call is FailedCall => "error" in call);
                if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
                const firstNoErrorCall = calls.find<any>((call): call is any => !("error" in call));
                if (!firstNoErrorCall) throw new Error("Unexpected error. Could not estimate gas for the swap.");
                bestCallOption = firstNoErrorCall;
            }

            setBestCall(bestCallOption);
        }

        swapCalldata && findBestCall();
    }, [swapCalldata, approvalState, account, chainId]);

    const swapConfig = useMemo(
        () =>
            bestCall
                ? {
                      address: ALGEBRA_ROUTER[chainId],
                      args: [bestCall.calldata] as const,
                      value: BigInt(bestCall.value),
                      gas: (bestCall.gasEstimate * (10000n + 2000n)) / 10000n,
                  }
                : undefined,
        [bestCall, chainId]
    );

    const { data: swapData, writeContractAsync: swapCallback } = useWriteAlgebraRouterMulticall();

    const { isLoading, isSuccess } = useTransactionAwait(swapData, {
        title: `Swap ${formatBalance(trade?.inputAmount.toSignificant() as string)} ${trade?.inputAmount.currency.symbol}`,
        tokenA: trade?.inputAmount.currency.wrapped.address as Address,
        tokenB: trade?.outputAmount.currency.wrapped.address as Address,
        type: TransactionType.SWAP,
    });

    return useMemo(() => {
        if (!trade)
            return {
                state: SwapCallbackState.INVALID,
                callback: null,
                error: "No trade was found",
                isLoading: false,
                isSuccess: false,
            };

        return {
            state: SwapCallbackState.VALID,
            callback: () => swapConfig && swapCallback(swapConfig),
            error: null,
            isLoading,
            isSuccess,
        };
    }, [trade, isLoading, swapCallback, swapConfig, isSuccess]);
}
