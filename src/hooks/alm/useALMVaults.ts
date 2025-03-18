import {
    getIchiVaultInfo,
    getVaultsByPool,
    SupportedChainId,
    SupportedDex,
    IchiVault,
    getLpApr,
    getTotalAmounts,
} from "@ichidao/ichi-vaults-sdk";
import useSWR from "swr";
import { DEFAULT_CHAIN_ID } from "@/constants/default-chain-id";
import { useEthersProvider } from "../common/useEthersProvider";
import { Currency } from "@cryptoalgebra/custom-pools-sdk";

export interface ExtendedVault extends IchiVault {
    apr: number;
    total0: string;
    total1: string;
    tvlUsd: number;
    currency: Currency;
}

export function useALMVaultsByPool(currencyA: Currency | undefined, currencyB: Currency | undefined, poolAddress: string | undefined) {
    const provider = useEthersProvider({ chainId: DEFAULT_CHAIN_ID });

    // const { price: currencyAPriceUSD } = useUSDCPrice(currencyA);
    // const { price: currencyBPriceUSD } = useUSDCPrice(currencyB);
    const currencyAPriceUSD = 1900;
    const currencyBPriceUSD = 1;

    const { data: vaults, isLoading } = useSWR(["vaults", poolAddress, provider, currencyA, currencyB], async () => {
        if (!provider || !currencyA || !currencyB) {
            throw new Error("No provider");
        }
        const vaults: ExtendedVault[] = [];
        const vaultAddresses: [{ vault: string }] = (await getVaultsByPool(
            "0x3a619042a383edb747d6b5ea915583c7cd844720",
            SupportedChainId.base,
            SupportedDex.Henjin
        )) as unknown as [{ vault: string }];

        for (const vault of vaultAddresses) {
            const vaultInfo: IchiVault = await getIchiVaultInfo(SupportedChainId.base, SupportedDex.Henjin, vault.vault);

            const [aprs] = await getLpApr(vault.vault, provider as any, SupportedDex.Henjin);

            const amounts: [string, string] & { total0: string; total1: string } = await getTotalAmounts(
                vault.vault,
                provider as any,
                SupportedDex.Henjin
            );

            const tvlUsd = Number(amounts.total0) * Number(currencyAPriceUSD) + Number(amounts.total1) * Number(currencyBPriceUSD);

            const extendedVault = {
                ...vaultInfo,
                apr: aprs?.apr || 0,
                tvlUsd,
                total0: amounts.total0,
                total1: amounts.total1,
                currency: vaultInfo.allowTokenA ? currencyA : currencyB,
            };

            vaults.push(extendedVault);
        }

        return vaults;
    });

    return { vaults, isLoading };
}
