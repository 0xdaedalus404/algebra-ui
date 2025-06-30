import { useDerivedSwapInfo } from "@/state/swapStore";
import { CurrenciesInfoHeader } from "@/components/common/CurrenciesInfoHeader";
import { useMemo, useState } from "react";
import { useClients } from "@/hooks/graphql/useClients";
import { CHART_SPAN, CHART_VIEW, ChartSpanType, POOL_CHART_TYPE } from "@/types/swap-chart";
import { usePoolDayDatasQuery, usePoolHourDatasQuery } from "@/graphql/generated/graphql";
import { computeCustomPoolAddress } from "@cryptoalgebra/custom-pools-sdk";
import { UNIX_TIMESTAMPS, isDefined } from "@/utils";
import { UTCTimestamp } from "lightweight-charts";
import { Chart } from "@/components/common/Chart";
import { CUSTOM_POOL_DEPLOYER_ADDRESSES } from "config/custom-pool-deployer";
import { useChainId } from "wagmi";
import { PoolState, usePool } from "@/hooks/pools/usePool";
import { Address } from "viem";
import { BarChart3Icon } from "lucide-react";

const SwapChart = () => {
    const chainId = useChainId();
    const { currencies } = useDerivedSwapInfo();

    const [tokenA, tokenB] = [currencies.INPUT, currencies.OUTPUT];

    const now = useMemo(() => Math.floor(Date.now() / 1000), []);
    const { infoClient } = useClients();

    const [span, setSpan] = useState<ChartSpanType>(CHART_SPAN.MONTH);

    const poolId = useMemo(() => {
        if (!tokenA || !tokenB) return undefined;
        return computeCustomPoolAddress({
            tokenA: tokenA.wrapped,
            tokenB: tokenB.wrapped,
            customPoolDeployer: CUSTOM_POOL_DEPLOYER_ADDRESSES.ALM[chainId],
        });
    }, [tokenA, tokenB, chainId]);

    const [poolStateType] = usePool(poolId as Address);
    const isPoolExists = poolStateType === PoolState.EXISTS;

    // const { token0, token1 } = pool || {};

    const { data: poolIndexerDayDatas } = usePoolDayDatasQuery({
        variables: {
            poolId: poolId?.toLowerCase() || "",
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * (span === CHART_SPAN.DAY ? 2 : 1),
            to: now,
        },
        client: infoClient,
        skip: !poolId,
    });

    const { data: poolIndexerHourDatas } = usePoolHourDatasQuery({
        variables: {
            poolId: poolId?.toLowerCase() || "",
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY],
            to: now,
        },
        client: infoClient,
        skip: !poolId || span === CHART_SPAN.MONTH || span === CHART_SPAN.THREE_MONTH || span === CHART_SPAN.YEAR,
    });

    const poolHourDatas = useMemo(() => {
        if (!poolIndexerHourDatas) return null;
        return poolIndexerHourDatas.poolHourDatas.map((d) => ({
            ...d,
            date: d.periodStartUnix,
        }));
    }, [poolIndexerHourDatas]);

    const poolDayDatas = useMemo(() => {
        if (!poolIndexerDayDatas) return [];
        return poolIndexerDayDatas.poolDayDatas;
    }, [poolIndexerDayDatas]);

    const chartData = useMemo(() => {
        const poolDatas = span === CHART_SPAN.DAY ? poolHourDatas : span === CHART_SPAN.WEEK ? poolHourDatas : poolDayDatas;

        if (!poolDatas?.[0]) return [];

        const isSorted = tokenA && tokenB && tokenA.wrapped.sortsBefore(tokenB.wrapped);

        const value = isSorted ? "token1Price" : "token0Price";

        const formattedData = poolDatas.filter(isDefined).map((v) => {
            return {
                time: v?.date as UTCTimestamp,
                value: Number(v[value]),
            };
        });

        return formattedData.slice(1);
    }, [poolDayDatas, poolHourDatas, span, tokenA, tokenB]);

    const currentValue = chartData.length ? chartData[chartData.length - 1].value : 0;

    const chartView = CHART_VIEW.LINE;

    return (
        <div className="flex flex-col p-3 w-full h-full min-h-fit relative rounded-xl bg-card border-card-border">
            <div className="flex flex-col px-4 pt-4 pb-0 gap-6">
                <CurrenciesInfoHeader tokenA={tokenA} tokenB={tokenB} />
                <hr className="border" />
            </div>
            {isPoolExists ? (
                <Chart
                    chartData={chartData}
                    chartSpan={span}
                    chartTitle={POOL_CHART_TYPE.PRICE}
                    chartView={chartView}
                    chartType={POOL_CHART_TYPE.PRICE}
                    setChartType={() => null}
                    setChartSpan={setSpan}
                    chartCurrentValue={currentValue}
                    showTypeSelector={false}
                    showAPR={false}
                    height={260}
                    tokenA={tokenA?.symbol}
                    tokenB={tokenB?.symbol}
                />
            ) : (
                <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                    <BarChart3Icon size={42} />
                    Chart coming soon...
                </div>
            )}
        </div>
    );
};

export default SwapChart;
