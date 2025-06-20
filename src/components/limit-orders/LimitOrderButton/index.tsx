import { Button } from "@/components/ui/button";
import { useNeedAllowance } from "@/hooks/common/useNeedAllowance";
import { useApprove } from "@/hooks/common/useApprove";
import { useTransactionAwait } from "@/hooks/common/useTransactionAwait";
import { useDerivedSwapInfo, useLimitOrderInfo } from "@/state/swapStore";
import { ChainId, Token, tryParseTick } from "@cryptoalgebra/custom-pools-sdk";
import { useAccount, useChainId } from "wagmi";
import { ALGEBRA_LIMIT_ORDER_PLUGIN, CUSTOM_POOL_DEPLOYER_LIMIT_ORDER, DEFAULT_CHAIN_NAME } from "config";
import { ApprovalState } from "@/types/approve-state";
import Loader from "@/components/common/Loader";
import { SwapField } from "@/types/swap-field";
import { formatCurrency } from "@/utils/common/formatCurrency";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { Address } from "viem";
import { useWriteAlgebraLimitOrderPluginPlace } from "@/generated";
import { useAppKit } from "@reown/appkit/react";

interface LimitOrderButtonProps {
    token0: Token | undefined;
    token1: Token | undefined;
    poolAddress: Address | undefined;
    disabled: boolean;
    sellPrice: string;
    wasInverted: boolean;
    tickSpacing: number | undefined;
    zeroToOne: boolean;
    limitOrderPlugin: boolean;
}

const LimitOrderButton = ({
    disabled,
    token0,
    token1,
    poolAddress,
    wasInverted,
    sellPrice,
    tickSpacing,
    zeroToOne,
    limitOrderPlugin,
}: LimitOrderButtonProps) => {
    const { address: account } = useAccount();

    const { open } = useAppKit();

    const selectedNetworkId = useChainId();

    const {
        currencies: { [SwapField.INPUT]: inputCurrency },
        toggledTrade: trade,
        inputError,
    } = useDerivedSwapInfo();

    const amount = trade && trade.inputAmount;

    const limitOrderTick = zeroToOne
        ? tryParseTick(token0, token1, sellPrice, tickSpacing)
        : tryParseTick(token1, token0, sellPrice, tickSpacing);

    const formattedTick = limitOrderTick ? (wasInverted ? -limitOrderTick : limitOrderTick) : undefined;

    const limitOrder = useLimitOrderInfo(poolAddress, amount, formattedTick);

    const chainId = useChainId();

    const needAllowance = useNeedAllowance(
        inputCurrency?.isNative ? undefined : inputCurrency?.wrapped,
        amount,
        ALGEBRA_LIMIT_ORDER_PLUGIN[chainId]
    );

    const isReady = token0 && token1 && amount && limitOrder && !disabled && !inputError && !needAllowance;

    const { approvalState, approvalCallback } = useApprove(amount, ALGEBRA_LIMIT_ORDER_PLUGIN[chainId]);

    const placeLimitOrderConfig = isReady
        ? {
              address: ALGEBRA_LIMIT_ORDER_PLUGIN[chainId],
              args: [
                  {
                      token0: token0.address as Address,
                      token1: token1.address as Address,
                      deployer: CUSTOM_POOL_DEPLOYER_LIMIT_ORDER[chainId],
                  },
                  limitOrder.tickLower,
                  zeroToOne,
                  BigInt(limitOrder.liquidity.toString()),
              ] as const,
              value: amount?.currency.isNative ? BigInt(amount.quotient.toString()) : BigInt(0),
          }
        : undefined;

    const { data: placeData, writeContract: placeLimitOrder } = useWriteAlgebraLimitOrderPluginPlace();

    const { isLoading: isPlaceLoading } = useTransactionAwait(placeData, {
        type: TransactionType.LIMIT_ORDER,
        title: `Buy ${formatCurrency.format(Number(amount?.toSignificant()))} ${amount?.currency.symbol}`,
    });

    const isWrongChain = !selectedNetworkId || ![ChainId.Base, ChainId.BaseSepolia].includes(selectedNetworkId);

    if (!account) return <Button onClick={() => open()}>Connect Wallet</Button>;

    if (isWrongChain)
        return (
            <Button variant={"destructive"} onClick={() => open({ view: "Networks" })}>
                {`Connect to ${DEFAULT_CHAIN_NAME}`}
            </Button>
        );

    if (!limitOrderPlugin) return <Button disabled>This pool doesn't support Limit Orders</Button>;

    if (!disabled && inputError) return <Button disabled>{inputError}</Button>;

    if (!disabled && needAllowance)
        return (
            <Button disabled={approvalState === ApprovalState.PENDING} onClick={() => approvalCallback && approvalCallback()}>
                {approvalState === ApprovalState.PENDING ? <Loader /> : `Approve ${amount?.currency.symbol}`}
            </Button>
        );

    return (
        <Button
            disabled={disabled || isPlaceLoading || approvalState === ApprovalState.PENDING}
            onClick={() => {
                console.log(
                    "[PLACE LIMIT ORDER]",
                    isReady && [
                        {
                            token0: token0.address as Address,
                            token1: token1.address as Address,
                        },
                        limitOrder.tickLower,
                        zeroToOne,
                        BigInt(limitOrder.liquidity.toString()),
                    ]
                );
                placeLimitOrderConfig && placeLimitOrder(placeLimitOrderConfig);
            }}
        >
            {isPlaceLoading ? <Loader /> : "Place an order"}
        </Button>
    );
};

export default LimitOrderButton;
