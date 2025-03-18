import PageContainer from "@/components/common/PageContainer";
import PageTitle from "@/components/common/PageTitle";
import { useAlgebraPoolToken0, useAlgebraPoolToken1 } from "@/generated";
import { useParams } from "react-router-dom";
import { Address } from "wagmi";
import { useCurrency } from "@/hooks/common/useCurrency";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CreateAutomatedPosition } from "./CreateAutomatedPosition";
import { CreateManualPosition } from "./CreateManualPosition";
import { cn } from "@/lib/utils";
import { useALMVaultsByPool } from "@/hooks/alm/useALMVaults";

type NewPositionPageParams = Record<"pool", Address>;

const NewPositionPage = () => {
    const [isALM, setIsALM] = useState<boolean | null>(null);

    const { pool: poolAddress } = useParams<NewPositionPageParams>();

    const { data: token0 } = useAlgebraPoolToken0({
        address: poolAddress,
    });

    const { data: token1 } = useAlgebraPoolToken1({
        address: poolAddress,
    });

    const currencyA = useCurrency(token0, true);
    const currencyB = useCurrency(token1, true);

    const { vaults } = useALMVaultsByPool(currencyA, currencyB, poolAddress);

    useEffect(() => {
        if (vaults && vaults.length > 0) {
            setIsALM(false);
        }
    }, [vaults]);

    return (
        <PageContainer>
            <PageTitle title={"Create Position"}>
                <div className="grid grid-cols-2 items-center border border-primary-button rounded-full">
                    <Button
                        onClick={() => setIsALM(false)}
                        size={"sm"}
                        className={cn("w-full", isALM ? "bg-transparent text-black" : "hover:bg-primary-button")}
                    >
                        Manually
                    </Button>
                    <Button
                        onClick={() => setIsALM(true)}
                        size={"sm"}
                        disabled={isALM === null}
                        className={cn(
                            "w-full disabled:cursor-not-allowed disabled:pointer-events-auto disabled:hover:bg-transparent",
                            !isALM ? "bg-transparent text-black" : "hover:bg-primary-button"
                        )}
                    >
                        Automated
                    </Button>
                </div>
            </PageTitle>
            {isALM ? (
                <CreateAutomatedPosition currencyA={currencyA} currencyB={currencyB} poolAddress={poolAddress} vaults={vaults} />
            ) : (
                <CreateManualPosition currency0={currencyA} currency1={currencyB} poolAddress={poolAddress} />
            )}
        </PageContainer>
    );
};

export default NewPositionPage;
