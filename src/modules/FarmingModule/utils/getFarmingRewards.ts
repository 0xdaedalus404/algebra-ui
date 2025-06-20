import { simulateFarmingCenterCollectRewards } from "@/generated";
import { wagmiConfig } from "@/providers/WagmiProvider";
import { FARMING_CENTER } from "config/contract-addresses";
import { Address } from "viem";

export async function getFarmingRewards({
    rewardToken,
    bonusRewardToken,
    pool,
    nonce,
    tokenId,
    chainId,
}: {
    rewardToken: Address;
    bonusRewardToken: Address;
    pool: Address;
    nonce: bigint;
    tokenId: bigint;
    chainId: number;
}): Promise<{ reward: bigint; bonusReward: bigint }> {
    try {
        const {
            result: [reward, bonusReward],
        } = await simulateFarmingCenterCollectRewards(wagmiConfig, {
            address: FARMING_CENTER[chainId],
            args: [
                {
                    rewardToken,
                    bonusRewardToken,
                    pool,
                    nonce,
                },
                tokenId,
            ],
        });

        return {
            reward,
            bonusReward,
        };
    } catch (e) {
        console.error(e);
        return {
            reward: 0n,
            bonusReward: 0n,
        };
    }
}
