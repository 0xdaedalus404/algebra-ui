import { useCallback, useEffect, useMemo, useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { useChainId, useSendTransaction } from "wagmi";

import { ALGEBRA_ROUTER } from "@/constants/addresses";

import { useTransactionAwait } from "../common/useTransactionAwait";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { algebraRouterABI } from "@/abis";
import { Currency } from "@cryptoalgebra/router-custom-pools-and-sliding-fee";
import { formatAmount } from "@/utils/common/formatAmount";
import { useUserState } from "@/state/userStore";
import { useWriteAlgebraRouterMulticall } from "@/generated";

export function useSmartRouterCallback(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    amount: string | undefined,
    calldata: Address | undefined,
    value: string | undefined
) {
    const [txHash, setTxHash] = useState<Address>();
    const chainId = useChainId();

    const config = calldata
        ? {
              address: ALGEBRA_ROUTER[chainId],
              args: [[calldata]] as const,
              value: BigInt(value || 0),
          }
        : undefined;

    const { data: swapData, writeContractAsync: writeAsync } = useWriteAlgebraRouterMulticall();

    useEffect(() => {
        if (swapData) {
            setTxHash(swapData);
        }
    }, [swapData]);

    const { isExpertMode } = useUserState();

    const { sendTransactionAsync } = useSendTransaction();

    const expertCallback = useCallback(async () => {
        if (!chainId || !calldata || !value) {
            console.error("Invalid params", { calldata, value });
            return;
        }

        const txData = {
            to: ALGEBRA_ROUTER[chainId],
            data: encodeFunctionData({
                abi: algebraRouterABI,
                functionName: "multicall",
                args: [[calldata]],
            }),
            value: BigInt(value || 0),
            gas: BigInt(1_000_000),
        };
        try {
            const txHash = await sendTransactionAsync(txData);
            setTxHash(txHash);
            console.log("Transaction Hash:", txHash);
            return txHash;
        } catch (error) {
            console.error("Send transaction Error:", error);
            throw error;
        }
    }, [chainId, calldata, value, sendTransactionAsync]);

    const { isLoading } = useTransactionAwait(txHash, {
        title: `Swap ${formatAmount(amount || "0", 6)} ${currencyA?.symbol}`,
        type: TransactionType.SWAP,
        tokenA: currencyA?.wrapped.address as Address,
        tokenB: currencyB?.wrapped.address as Address,
    });

    return useMemo(
        () => ({
            callback: isExpertMode ? expertCallback : () => config && writeAsync(config),
            isLoading,
        }),
        [expertCallback, isExpertMode, writeAsync, isLoading]
    );
}
