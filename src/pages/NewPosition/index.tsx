import PageContainer from "@/components/common/PageContainer";
import PageTitle from "@/components/common/PageTitle";
import { useParams } from "react-router-dom";
import { useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CreateManualPosition } from "./CreateManualPosition";
import { cn } from "@/utils/common/cn";
import { useCustomPoolDeployerQuery } from "@/graphql/generated/graphql";
import { useClients } from "@/hooks/graphql/useClients";
import { Address } from "viem";

import ALMModule from "@/modules/ALMModule";
import { CUSTOM_POOL_DEPLOYER_ADDRESSES } from "config/custom-pool-deployer";
import { enabledModules } from "config/modules";
const { useALMVaultsByPool } = ALMModule.hooks;
const { CreateAutomatedPosition } = ALMModule.components;

type NewPositionPageParams = Record<"pool", Address>;

const NewPositionPage = () => {
    const chainId = useChainId();
    const [isALM, setIsALM] = useState<boolean | null>(null);

    const { pool: poolAddress } = useParams<NewPositionPageParams>();

    const { infoClient } = useClients();

    const { data, loading: isCustomPoolDeployerLoading } = useCustomPoolDeployerQuery({
        variables: { poolId: poolAddress as string },
        skip: !poolAddress,
        client: infoClient,
    });

    const isALMPool =
        data?.pool?.deployer && CUSTOM_POOL_DEPLOYER_ADDRESSES.ALM[chainId]
            ? data.pool.deployer.toLowerCase() === CUSTOM_POOL_DEPLOYER_ADDRESSES.ALM[chainId].toLowerCase()
            : false;

    const { vaults } = useALMVaultsByPool(isALMPool ? poolAddress : undefined);

    useEffect(() => {
        if (vaults && vaults.length > 0) {
            setIsALM(false);
        }
    }, [vaults]);

    return (
        <PageContainer>
            <PageTitle title={"Create Position"}>
                {!isCustomPoolDeployerLoading && isALMPool && enabledModules.alm && (
                    <div className="grid grid-cols-2 items-center border border-primary-button rounded-full">
                        <Button
                            onClick={() => setIsALM(false)}
                            size={"sm"}
                            className={cn("w-full", isALM ? "bg-transparent text-primary-foreground" : "hover:bg-primary-button")}
                        >
                            Manually
                        </Button>
                        <Button
                            onClick={() => setIsALM(true)}
                            size={"sm"}
                            disabled={isALM === null}
                            className={cn(
                                "w-full disabled:cursor-not-allowed disabled:pointer-events-auto disabled:hover:bg-transparent",
                                !isALM ? "bg-transparent text-primary-foreground" : "hover:bg-primary-button"
                            )}
                        >
                            Automated
                        </Button>
                    </div>
                )}
            </PageTitle>
            {isALM ? <CreateAutomatedPosition poolId={poolAddress} vaults={vaults} /> : <CreateManualPosition poolAddress={poolAddress} />}
        </PageContainer>
    );
};

export default NewPositionPage;
