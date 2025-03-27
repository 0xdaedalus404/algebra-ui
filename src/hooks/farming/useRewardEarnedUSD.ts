import { TokenFieldsFragment, useNativePriceQuery } from "@/graphql/generated/graphql";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { useClients } from "../graphql/useClients";

export function useRewardEarnedUSD({ token, reward }: { token: TokenFieldsFragment | null; reward: bigint }): number {
    const { infoClient } = useClients();
    const { data: nativePrice } = useNativePriceQuery({ client: infoClient });

    return useMemo(() => {
        if (!token || !nativePrice) return 0;

        const formattedRewardEarned = Number(formatUnits(reward, token.decimals));

        const rewardUSD = token.derivedMatic * formattedRewardEarned * nativePrice.bundles[0].maticPriceUSD;

        return rewardUSD;
    }, [nativePrice, token, reward]);
}
