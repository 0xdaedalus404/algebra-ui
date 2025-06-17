import { MAX_UINT128 } from "@/constants/max-uint128";
import { readAlgebraPositionManagerOwnerOf, simulateAlgebraPositionManagerCollect } from "@/generated";
import { wagmiConfig } from "@/providers/WagmiProvider";
import { CurrencyAmount, Pool, unwrappedToken } from "@cryptoalgebra/custom-pools-sdk";

export async function getPositionFees(pool: Pool, positionId: number) {
    try {
        const owner = await readAlgebraPositionManagerOwnerOf(wagmiConfig, {
            chainId: pool.chainId as 8453 | 84532,
            args: [BigInt(positionId)],
        });

        const {
            result: [fees0, fees1],
        } = await simulateAlgebraPositionManagerCollect(wagmiConfig, {
            args: [
                {
                    tokenId: BigInt(positionId),
                    recipient: owner,
                    amount0Max: MAX_UINT128,
                    amount1Max: MAX_UINT128,
                },
            ],
            account: owner,
        });

        return [
            CurrencyAmount.fromRawAmount(unwrappedToken(pool.token0), fees0.toString()),
            CurrencyAmount.fromRawAmount(unwrappedToken(pool.token1), fees1.toString()),
        ];
    } catch (err) {
        console.error(err);
        return [undefined, undefined];
    }
}
