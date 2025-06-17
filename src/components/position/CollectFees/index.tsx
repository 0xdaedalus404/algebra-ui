import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWriteAlgebraPositionManagerMulticall } from "@/generated";
import { useTransactionAwait } from "@/hooks/common/useTransactionAwait";
import { usePositionFees } from "@/hooks/positions/usePositionFees";
import { IDerivedMintInfo } from "@/state/mintStore";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { NonfungiblePositionManager } from "@cryptoalgebra/custom-pools-sdk";
import { useMemo } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

interface CollectFeesProps {
    mintInfo: IDerivedMintInfo;
    positionFeesUSD: string | undefined;
    positionId: number;
}

const CollectFees = ({ mintInfo, positionFeesUSD, positionId }: CollectFeesProps) => {
    const { address: account } = useAccount();

    const pool = mintInfo.pool;

    const { amount0, amount1 } = usePositionFees(pool ?? undefined, positionId, false);

    const zeroRewards = amount0?.equalTo("0") && amount1?.equalTo("0");

    const { calldata, value } = useMemo(() => {
        if (!account || !amount0 || !amount1) return { calldata: undefined, value: undefined };

        return NonfungiblePositionManager.collectCallParameters({
            tokenId: positionId.toString(),
            expectedCurrencyOwed0: amount0,
            expectedCurrencyOwed1: amount1,
            recipient: account,
        });
    }, [positionId, amount0, amount1, account]);

    const collectConfig = calldata
        ? {
              args: [calldata as `0x${string}`[]] as const,
              value: BigInt(value || 0),
          }
        : undefined;

    const { data: collectData, writeContract: collect } = useWriteAlgebraPositionManagerMulticall();

    const { isLoading } = useTransactionAwait(collectData, {
        title: "Collect fees",
        tokenA: mintInfo.currencies.CURRENCY_A?.wrapped.address as Address,
        tokenB: mintInfo.currencies.CURRENCY_B?.wrapped.address as Address,
        type: TransactionType.POOL,
    });

    return (
        <div className="flex w-full justify-between bg-card-dark p-4 rounded-xl">
            <div className="text-left">
                <div className="font-bold text-xs">EARNED FEES</div>
                <div className="font-semibold text-2xl">
                    {positionFeesUSD ? (
                        <span className="text-cyan-300">{positionFeesUSD}</span>
                    ) : (
                        <Skeleton className="w-[100px] h-[30px]" />
                    )}
                </div>
            </div>
            <Button size={"md"} disabled={!collect || zeroRewards || isLoading} onClick={() => collectConfig && collect(collectConfig)}>
                {isLoading ? <Loader /> : "Collect fees"}
            </Button>
        </div>
    );
};

export default CollectFees;
