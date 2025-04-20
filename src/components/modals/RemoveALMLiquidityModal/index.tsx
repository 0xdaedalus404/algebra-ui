import { CurrencyAmounts } from "@/components/common/CurrencyAmounts";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { UserALMVault, useUserALMVaultsByPool } from "@/hooks/alm/useUserALMVaults";
import { useEthersSigner } from "@/hooks/common/useEthersProvider";
import { useTransactionAwait } from "@/hooks/common/useTransactionAwait";
import { useBurnActionHandlers, useBurnState } from "@/state/burnStore";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { SupportedDex, withdrawNativeToken, withdraw } from "@cryptoalgebra/alm-sdk";
import { useCallback, useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";

interface RemoveALMLiquidityModalProps {
    userVault: UserALMVault | undefined;
    poolAddress: Address | undefined;
}

const RemoveALMLiquidityModal = ({ userVault, poolAddress }: RemoveALMLiquidityModalProps) => {
    const [sliderValue, setSliderValue] = useState([50]);

    const { address: account } = useAccount();

    const { percent } = useBurnState();
    const percentMultiplier = percent / 100;

    const { onPercentSelect } = useBurnActionHandlers();

    const vault = userVault?.vault;
    const { token0, token1 } = vault || {};
    const currency = vault?.depositToken;
    const useNative = currency?.isNative ? currency : undefined;

    const { refetch: refetchUserVaults } = useUserALMVaultsByPool(poolAddress, account);

    const provider = useEthersSigner();

    const [isPending, setIsPending] = useState(false);
    const [txHash, setTxHash] = useState<Address | undefined>();

    const callback = useCallback(async () => {
        if (!vault || !percent || !account || !provider) return;
        setIsPending(true);

        const shareToWithdraw = Number(userVault.shares) * percentMultiplier;

        try {
            let tx;
            if (useNative) {
                tx = await withdrawNativeToken(account, shareToWithdraw, vault.id, provider, SupportedDex.CLAMM);
            } else {
                tx = await withdraw(account, shareToWithdraw, vault.id, provider, SupportedDex.CLAMM);
            }

            setTxHash(tx.hash as Address);
        } catch (e) {
            console.log(e);
        } finally {
            setIsPending(false);
        }
    }, [vault, percent, account, provider, userVault?.shares, percentMultiplier, useNative]);

    const { isLoading: isRemoveLoading, isSuccess } = useTransactionAwait(txHash, {
        title: "Remove ALM liquidity",
        tokenA: vault?.token0.wrapped.address as Address,
        tokenB: vault?.token1.wrapped.address as Address,
        type: TransactionType.POOL,
    });

    useEffect(() => {
        if (!isSuccess) return;

        console.log("refetchUserVaults");
        refetchUserVaults();
    }, [isSuccess]);

    const isDisabled = sliderValue[0] === 0 || isRemoveLoading || isPending;

    useEffect(() => {
        onPercentSelect(sliderValue[0]);
    }, [sliderValue]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="w-full">
                    Remove Liquidity
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[500px] rounded-3xl bg-card" style={{ borderRadius: "32px" }}>
                <DialogHeader>
                    <DialogTitle className="font-bold select-none">Remove Liquidity</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-bold select-none">{`${sliderValue}%`}</h2>

                    <div className="flex gap-2">
                        {[25, 50, 75, 100].map((v) => (
                            <Button
                                key={`liquidity-percent-${v}`}
                                disabled={isRemoveLoading}
                                variant={"icon"}
                                className="border border-card-border"
                                size={"sm"}
                                onClick={() => setSliderValue([v])}
                            >
                                {v}%
                            </Button>
                        ))}
                    </div>

                    <Slider
                        value={sliderValue}
                        id="liquidity-percent"
                        max={100}
                        defaultValue={sliderValue}
                        step={1}
                        onValueChange={(v) => setSliderValue(v)}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        aria-label="Liquidity Percent"
                        disabled={isRemoveLoading || isPending}
                    />

                    <CurrencyAmounts
                        amount0Parsed={userVault?.amount0 && (Number(userVault.amount0) * percentMultiplier).toString()}
                        amount1Parsed={userVault?.amount1 && (Number(userVault.amount1) * percentMultiplier).toString()}
                        token0={token0}
                        token1={token1}
                    />

                    <Button disabled={isDisabled} onClick={callback}>
                        {isRemoveLoading ? <Loader /> : "Remove Liquidity"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

RemoveALMLiquidityModal.whyDidYouRender = true;

export default RemoveALMLiquidityModal;
