import { Address, formatUnits } from "viem";
import { ExtendedVault, useALMVaultsByPool } from "./useALMVaults";
import useSWR from "swr";
import { useEthersSigner } from "../common/useEthersProvider";
import { getTotalAmounts, getTotalSupply, getUserBalance, SupportedDex } from "@cryptoalgebra/alm-sdk";
import { useUSDCPrice } from "../common/useUSDCValue";

export interface UserALMVault {
    amount0: string;
    amount1: string;
    amountsUsd: number;
    shares: string;
    vault: ExtendedVault;
}

export function useUserALMVaultsByPool(poolAddress: Address | undefined, account: Address | undefined) {
    const provider = useEthersSigner();
    const { vaults, isLoading: isVaultsLoading } = useALMVaultsByPool(poolAddress);

    const { formatted: currencyAPriceUSD } = useUSDCPrice(vaults?.[0]?.token0);
    const { formatted: currencyBPriceUSD } = useUSDCPrice(vaults?.[0]?.token1);

    const { data: userVaults, isLoading } = useSWR(
        ["userVaults", account, vaults, poolAddress],
        async (): Promise<UserALMVault[]> => {
            if (!provider || !account || !vaults) {
                throw new Error("not ready");
            }

            const userALMVaults: UserALMVault[] = [];
            const dex = SupportedDex.CLAMM;

            for (const vault of vaults) {
                const [totalAmounts, totalSupply, shares] = await Promise.all([
                    getTotalAmounts(vault.id, provider, dex, true, vault.token0.decimals, vault.token1.decimals),
                    getTotalSupply(vault.id, provider, dex),
                    getUserBalance(account, vault.id, provider, dex),
                ]);

                if (shares === "0") continue;

                const userAmounts = [
                    (Number(shares) * Number(totalAmounts[0].toBigInt())) / Number(totalSupply),
                    (Number(shares) * Number(totalAmounts[1].toBigInt())) / Number(totalSupply),
                ];

                const formattedUserAmounts = [
                    formatUnits(BigInt(userAmounts[0].toFixed(0)), vault.token0.decimals),
                    formatUnits(BigInt(userAmounts[1].toFixed(0)), vault.token1.decimals),
                ];

                userALMVaults.push({
                    amount0: formattedUserAmounts[0],
                    amount1: formattedUserAmounts[1],
                    shares,
                    amountsUsd: Number(formattedUserAmounts[0]) * currencyAPriceUSD + Number(formattedUserAmounts[1]) * currencyBPriceUSD,
                    vault: vault,
                });
            }

            return userALMVaults;
        },
        {
            revalidateOnMount: true,
            revalidateOnFocus: true,
            refreshInterval: 15_000,
        }
    );

    return { userVaults, isLoading: isLoading || isVaultsLoading };
}
