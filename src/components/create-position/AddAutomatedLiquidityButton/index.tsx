import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { DEFAULT_CHAIN_NAME } from "@/constants/default-chain-id";
import { ExtendedVault } from "@/hooks/alm/useALMVaults";
import { useApprove } from "@/hooks/common/useApprove";
import { useEthersSigner } from "@/hooks/common/useEthersProvider";
import { useTransactionAwait } from "@/hooks/common/useTransactionAwait";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { ApprovalState } from "@/types/approve-state";
import { ChainId, Currency, CurrencyAmount } from "@cryptoalgebra/custom-pools-sdk";
import { deposit, depositNativeToken, SupportedChainId, SupportedDex, VAULT_DEPOSIT_GUARD } from "@cryptoalgebra/alm-sdk";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Address, useAccount, useChainId } from "wagmi";

const dex = SupportedDex.CLAMM;

interface AddAutomatedLiquidityButtonProps {
    vault: ExtendedVault | undefined;
    amount: CurrencyAmount<Currency> | undefined;
}

export const AddAutomatedLiquidityButton = ({ vault, amount }: AddAutomatedLiquidityButtonProps) => {
    const { address: account } = useAccount();
    const chainId = useChainId();

    const { open } = useWeb3Modal();

    const { selectedNetworkId } = useWeb3ModalState();

    const { poolId } = useParams();

    const currency = vault?.depositToken;
    const useNative = currency?.isNative ? currency : undefined;

    const { approvalState: approvalStateA, approvalCallback: approvalCallbackA } = useApprove(
        amount,
        VAULT_DEPOSIT_GUARD[chainId as SupportedChainId][dex] as Address
    );

    const isApprovePending = approvalStateA === ApprovalState.PENDING;

    const showApproveA = approvalStateA === ApprovalState.NOT_APPROVED || isApprovePending;

    const isReady = approvalStateA === ApprovalState.APPROVED;

    const provider = useEthersSigner();

    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState<Address | undefined>();

    const callback = useCallback(async () => {
        if (!vault || !amount || !account || !provider) return;
        setIsPending(true);

        try {
            let tx;
            if (useNative) {
                tx = await depositNativeToken(
                    account,
                    vault.allowTokenA ? amount.toExact() : "0",
                    vault.allowTokenB ? amount.toExact() : "0",
                    vault.id,
                    provider,
                    dex
                );
            } else {
                tx = await deposit(
                    account,
                    vault.allowTokenA ? amount.toExact() : "0",
                    vault.allowTokenB ? amount.toExact() : "0",
                    vault.id,
                    provider,
                    dex
                );
            }

            setTxHash(tx.hash as Address);
        } catch (e) {
            console.log(e);
        } finally {
            setIsPending(false);
        }
    }, [vault, amount?.quotient.toString(), account, provider, useNative]);

    const { isLoading: isAddingLiquidityLoading } = useTransactionAwait(
        txHash,
        {
            title: "Add automated liquidity",
            tokenA: currency?.wrapped.address as Address,
            type: TransactionType.POOL,
        },
        `/pool/${poolId}`
    );

    const isWrongChain = !selectedNetworkId || ![ChainId.Base, ChainId.BaseSepolia].includes(selectedNetworkId);

    if (!account) return <Button onClick={() => open()}>Connect Wallet</Button>;

    if (isWrongChain)
        return (
            <Button
                variant={"destructive"}
                onClick={() => open({ view: "Networks" })}
            >{`Connect to ${DEFAULT_CHAIN_NAME[chainId]}`}</Button>
        );

    // if (mintInfo.errorMessage) return <Button disabled>{mintInfo.errorMessage}</Button>;

    if (showApproveA)
        return (
            <div className="flex w-full gap-2">
                {showApproveA && (
                    <Button disabled={isApprovePending} className="w-full" onClick={approvalCallbackA}>
                        {isApprovePending ? <Loader /> : `Approve ${currency?.symbol}`}
                    </Button>
                )}
            </div>
        );

    return (
        <Button disabled={!isReady || isPending || isAddingLiquidityLoading} onClick={callback}>
            {isAddingLiquidityLoading || isPending ? <Loader /> : "Create Position"}
        </Button>
    );
};

export default AddAutomatedLiquidityButton;
