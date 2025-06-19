import { Button } from "@/components/ui/button";
import { useDerivedSwapInfo, useSwapState } from "@/state/swapStore";
import { useEffect, useMemo, useState } from "react";
import { SwapField } from "@/types/swap-field";
import {
    computePoolAddress,
    computeCustomPoolAddress,
    NonfungiblePositionManager,
    ADDRESS_ZERO,
    INITIAL_POOL_FEE,
} from "@cryptoalgebra/custom-pools-sdk";
import { useTransactionAwait } from "@/hooks/common/useTransactionAwait";
import { useAccount, useChainId } from "wagmi";
import { useDerivedMintInfo, useMintState } from "@/state/mintStore";
import Loader from "@/components/common/Loader";
import { PoolState, usePool } from "@/hooks/pools/usePool";
import Summary from "../Summary";
import SelectPair from "../SelectPair";
import { STABLECOINS, CUSTOM_POOL_BASE, CUSTOM_POOL_DEPLOYER_ALM, CUSTOM_POOL_DEPLOYER_LIMIT_ORDER } from "config";
import { TransactionType } from "@/state/pendingTransactionsStore";
import { cn } from "@/utils/common/cn";

import FixBrokenPool from "../FixBrokenPool";
import { Address } from "viem";
import { useWriteAlgebraCustomPoolDeployerCreateCustomPool, useWriteAlgebraPositionManagerMulticall } from "@/generated";

const POOL_DEPLOYER = {
    BASE: "Base",
    LIMIT_ORDER: "Limit Order",
    ALM: "ALM",
};

type PoolDeployerType = (typeof POOL_DEPLOYER)[keyof typeof POOL_DEPLOYER];

const CreatePoolForm = () => {
    const { address: account } = useAccount();

    const { currencies } = useDerivedSwapInfo();

    const {
        actions: { selectCurrency },
    } = useSwapState();

    const {
        startPriceTypedValue,
        actions: { typeStartPriceInput },
    } = useMintState();

    const chainid = useChainId();

    const [poolDeployer, setPoolDeployer] = useState<PoolDeployerType>(POOL_DEPLOYER.BASE);

    const currencyA = currencies[SwapField.INPUT];
    const currencyB = currencies[SwapField.OUTPUT];

    const areCurrenciesSelected = currencyA && currencyB;

    const isSameToken = areCurrenciesSelected && currencyA.wrapped.equals(currencyB.wrapped);

    const customPoolDeployerAddresses = useMemo(
        () => ({
            [POOL_DEPLOYER.BASE]: CUSTOM_POOL_BASE[chainid],
            [POOL_DEPLOYER.LIMIT_ORDER]: CUSTOM_POOL_DEPLOYER_LIMIT_ORDER[chainid],
            [POOL_DEPLOYER.ALM]: CUSTOM_POOL_DEPLOYER_ALM[chainid],
        }),
        [chainid]
    );

    const poolAddress =
        areCurrenciesSelected && !isSameToken
            ? (computePoolAddress({
                  tokenA: currencyA.wrapped,
                  tokenB: currencyB.wrapped,
              }) as Address)
            : undefined;

    const customPoolsAddresses =
        areCurrenciesSelected && !isSameToken
            ? [CUSTOM_POOL_DEPLOYER_LIMIT_ORDER[chainid], CUSTOM_POOL_DEPLOYER_ALM[chainid]]
                  .filter((deployer): deployer is Address => deployer !== undefined)
                  .map(
                      (customPoolDeployer) =>
                          computeCustomPoolAddress({
                              tokenA: currencyA.wrapped,
                              tokenB: currencyB.wrapped,
                              customPoolDeployer,
                          }) as Address
                  )
            : [];

    const [poolState] = usePool(poolAddress);

    // TODO
    const [poolState0] = usePool(customPoolsAddresses[0]);
    const [poolState1] = usePool(customPoolsAddresses[1]);

    const isPoolExists = poolState === PoolState.EXISTS && poolDeployer === POOL_DEPLOYER.BASE;
    const isPool0Exists = poolState0 === PoolState.EXISTS && poolDeployer === POOL_DEPLOYER.LIMIT_ORDER;
    const isPool1Exists = poolState1 === PoolState.EXISTS && poolDeployer === POOL_DEPLOYER.ALM;

    const isSelectedCustomPoolExists = isPoolExists || isPool0Exists || isPool1Exists;

    const mintInfo = useDerivedMintInfo(
        currencyA ?? undefined,
        currencyB ?? undefined,
        poolAddress ?? undefined,
        INITIAL_POOL_FEE,
        currencyA ?? undefined,
        undefined
    );

    const { calldata, value } = useMemo(() => {
        if (!mintInfo?.pool)
            return {
                calldata: undefined,
                value: undefined,
            };

        return NonfungiblePositionManager.createCallParameters(mintInfo.pool, customPoolDeployerAddresses[poolDeployer]);
    }, [mintInfo?.pool, poolDeployer]);

    const { data: createBasePoolData, writeContract: createBasePool } = useWriteAlgebraPositionManagerMulticall();

    const createBasePoolConfig = {
        args: Array.isArray(calldata) ? ([calldata as Address[]] as const) : ([[calldata] as Address[]] as const),
        value: BigInt(value || 0),
        enabled: Boolean(calldata),
    };

    const { isLoading: isBasePoolLoading } = useTransactionAwait(
        createBasePoolData,
        {
            title: "Create Base Pool",
            tokenA: currencyA?.wrapped.address as Address,
            tokenB: currencyB?.wrapped.address as Address,
            type: TransactionType.POOL,
        },
        "/pools"
    );

    const isCustomPoolDeployerReady = account && mintInfo.pool && poolDeployer !== POOL_DEPLOYER.BASE;

    const createCustomPoolConfig = isCustomPoolDeployerReady
        ? {
              address: customPoolDeployerAddresses[poolDeployer],
              args: [
                  customPoolDeployerAddresses[poolDeployer],
                  account,
                  mintInfo.pool?.token0.address as Address,
                  mintInfo.pool?.token1.address as Address,
                  "0x0",
              ] as const,
          }
        : undefined;

    const { data: createCustomPoolData, writeContract: createCustomPool } = useWriteAlgebraCustomPoolDeployerCreateCustomPool();

    const { isLoading: isCustomPoolLoading } = useTransactionAwait(createCustomPoolData, {
        title: "Create Custom Pool",
        tokenA: currencyA?.wrapped.address as Address,
        tokenB: currencyB?.wrapped.address as Address,
        type: TransactionType.POOL,
    });

    const isLoading = isCustomPoolLoading || isBasePoolLoading;

    useEffect(() => {
        selectCurrency(SwapField.INPUT, undefined);
        selectCurrency(SwapField.OUTPUT, undefined);
        typeStartPriceInput("");

        return () => {
            selectCurrency(SwapField.INPUT, ADDRESS_ZERO);
            selectCurrency(SwapField.OUTPUT, STABLECOINS[chainid].USDC.address as Address);
            typeStartPriceInput("");
        };
    }, []);

    const handlePoolDeployerChange = (poolDeployer: PoolDeployerType) => {
        setPoolDeployer(poolDeployer);
    };

    const handleCreatePool = () => {
        if (poolDeployer === POOL_DEPLOYER.BASE) {
            if (!createBasePool) return;
            createBasePool(createBasePoolConfig);
        }
        if (!createCustomPoolConfig) return;
        createCustomPool(createCustomPoolConfig);
    };

    const isDisabled = Boolean(isLoading || isSelectedCustomPoolExists || !startPriceTypedValue || !areCurrenciesSelected || isSameToken);

    return (
        <div className="flex flex-col gap-1 p-2 bg-card border border-card-border rounded-3xl">
            <h2 className="font-semibold text-xl text-left ml-2 mt-2">Select Pair</h2>
            <SelectPair mintInfo={mintInfo} currencyA={currencyA} currencyB={currencyB} />

            {areCurrenciesSelected && !isSameToken && !isSelectedCustomPoolExists && (
                <Summary currencyA={currencyA} currencyB={currencyB} />
            )}

            <div className="text-left font-bold">
                <div>Plugin</div>
                <div className="grid grid-cols-2 w-full gap-4 my-2">
                    {Object.entries(POOL_DEPLOYER).map(([, v]) => (
                        <button
                            key={v}
                            onClick={() => handlePoolDeployerChange(v)}
                            className={cn("px-3 py-2 rounded-lg border", poolDeployer === v ? "border-primary-button" : "")}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <Button className="mt-2" disabled={isDisabled} onClick={handleCreatePool}>
                {isLoading ? (
                    <Loader />
                ) : isSameToken ? (
                    "Select another pair"
                ) : !areCurrenciesSelected ? (
                    "Select currencies"
                ) : isSelectedCustomPoolExists ? (
                    "Pool already exists"
                ) : !startPriceTypedValue ? (
                    "Enter initial price"
                ) : (
                    "Create Pool"
                )}
            </Button>

            {poolDeployer !== POOL_DEPLOYER.BASE && (
                <Button disabled={isDisabled} onClick={() => createBasePool(createBasePoolConfig)} className="mt-2">
                    {isBasePoolLoading ? <Loader /> : "Initialize"}
                </Button>
            )}

            <FixBrokenPool currencyIn={currencyA} currencyOut={currencyB} deployer={customPoolDeployerAddresses[poolDeployer]} />
        </div>
    );
};

export default CreatePoolForm;
