import { useMemo } from "react";
import { ChainId, Currency, CurrencyAmount, Percent, Trade, TradeType } from "@cryptoalgebra/custom-pools-sdk";
import {
    Currency as CurrencyBN,
    CurrencyAmount as CurrencyAmountBN,
    Percent as PercentBN,
    SmartRouter,
    SmartRouterTrade,
} from "@cryptoalgebra/router-custom-pools-and-sliding-fee";

import { ALGEBRA_ROUTER } from "@/constants/addresses";
import { ApprovalState, ApprovalStateType } from "@/types/approve-state";

import { useNeedAllowance } from "./useNeedAllowance";
import { useTransactionAwait } from "./useTransactionAwait";
import { TransactionType } from "@/state/pendingTransactionsStore.ts";
import { formatBalance } from "@/utils/common/formatBalance.ts";
import { Address, erc20Abi } from "viem";
import { useWriteContract } from "wagmi";

export function useApprove(amountToApprove: CurrencyAmount<Currency> | CurrencyAmountBN<CurrencyBN> | undefined, spender: Address) {
    const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined;
    const needAllowance = useNeedAllowance(token, amountToApprove, spender);

    const approvalState: ApprovalStateType = useMemo(() => {
        if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
        if (amountToApprove.currency.isNative) return ApprovalState.APPROVED;

        return needAllowance ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED;
    }, [amountToApprove, needAllowance, spender]);

    const config = amountToApprove
        ? {
              address: amountToApprove.currency.wrapped.address as Address,
              abi: erc20Abi,
              functionName: "approve" as const,
              args: [spender, BigInt(amountToApprove.quotient.toString())] as [Address, bigint],
          }
        : undefined;

    const { data: approvalData, writeContract: approve } = useWriteContract();

    const { isLoading, isSuccess } = useTransactionAwait(approvalData, {
        title: `Approve ${formatBalance(amountToApprove?.toSignificant() as string)} ${amountToApprove?.currency.symbol}`,
        tokenA: token?.address as Address,
        type: TransactionType.SWAP,
    });

    return {
        approvalState: isLoading
            ? ApprovalState.PENDING
            : isSuccess && approvalState === ApprovalState.APPROVED
              ? ApprovalState.APPROVED
              : approvalState,
        approvalCallback: () => config && approve(config),
    };
}

export function useApproveCallbackFromTrade(trade: Trade<Currency, Currency, TradeType> | undefined, allowedSlippage: Percent) {
    const amountToApprove = useMemo(
        () => (trade && trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined),
        [trade, allowedSlippage]
    );
    return useApprove(amountToApprove, ALGEBRA_ROUTER[amountToApprove?.currency.chainId || ChainId.Base]);
}

export function useApproveCallbackFromSmartTrade(trade: SmartRouterTrade<TradeType> | undefined, allowedSlippage: Percent) {
    const allowedSlippageBN = useMemo(
        () => new PercentBN(BigInt(allowedSlippage.numerator.toString()), BigInt(allowedSlippage.denominator.toString())),
        [allowedSlippage]
    );

    const amountToApprove = useMemo(
        () => (trade && trade.inputAmount.currency.isToken ? SmartRouter.maximumAmountIn(trade, allowedSlippageBN) : undefined),
        [trade, allowedSlippageBN]
    );

    return useApprove(amountToApprove, ALGEBRA_ROUTER[amountToApprove?.currency.chainId || ChainId.Base]);
}
