import { ALGEBRA_POSITION_MANAGER, FARMING_CENTER } from "@/constants/addresses";
import { useChainId } from "wagmi";
import { useTransactionAwait } from "../common/useTransactionAwait";
import { useEffect } from "react";
import { useFarmCheckApprove } from "./useFarmCheckApprove";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { useWriteAlgebraPositionManagerApproveForFarming } from "@/generated";

export function useFarmApprove(tokenId: bigint) {
    const chainId = useChainId();
    const APPROVE = true;

    const config = tokenId
        ? {
              address: ALGEBRA_POSITION_MANAGER[chainId],
              args: [tokenId, APPROVE, FARMING_CENTER[chainId]] as const,
          }
        : undefined;

    const { data: data, writeContractAsync: onApprove } = useWriteAlgebraPositionManagerApproveForFarming();

    const { isLoading, isSuccess } = useTransactionAwait(data, {
        title: `Approve Position #${tokenId}`,
        tokenId: tokenId.toString(),
        type: TransactionType.FARM,
    });

    const { handleCheckApprove } = useFarmCheckApprove(tokenId);

    useEffect(() => {
        if (isSuccess) {
            handleCheckApprove();
        }
    }, [isSuccess]);

    return {
        isLoading,
        isSuccess,
        onApprove: () => config && onApprove(config),
    };
}
