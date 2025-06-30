import { useMemo, useState } from "react";
import { UTCTimestamp } from "lightweight-charts";
import { CHART_SPAN, CHART_TYPE, CHART_VIEW, ChartSpanType, ChartTypeType, ChartViewType } from "@/types/swap-chart";
import { Chart } from "../";
import { getPercentChange, UNIX_TIMESTAMPS } from "@/utils";
import { isDefined } from "@/utils/common/isDefined";
import TotalStats from "../TotalStats";
import { useAlgebraDayDatasQuery } from "@/graphql/generated/graphql";
import PageTitle from "@/components/common/PageTitle";
import { useClients } from "@/hooks/graphql/useClients";

function ChartComponent({
    now,
    title,
    selector,
    chartType,
    chartView,
    height,
    showTypeSelector = false,
}: {
    now: number;
    title: string;
    selector: "tvlUSD" | "volumeUSD" | "feesUSD";
    chartType: ChartTypeType;
    chartView: ChartViewType;
    height: number;
    showTypeSelector?: boolean;
}) {
    const { infoClient } = useClients();

    const [span, setSpan] = useState<ChartSpanType>(CHART_SPAN.MONTH);
    const [type, setType] = useState<ChartTypeType>(chartType);

    const { data: algebraIndexerDayDatas, loading: isAlgebraIndexerDayDatasLoading } = useAlgebraDayDatasQuery({
        variables: {
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * 2,
            to: now,
        },
        client: infoClient,
    });

    // const { data: algebraIndexerHourDatas } = useAlgebraHourDatasQuery({
    //     variables: {
    //         from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY],
    //         to: now,
    //     },
    //     client: infoClient,
    //     skip: span === CHART_SPAN.MONTH || span === CHART_SPAN.THREE_MONTH || span === CHART_SPAN.YEAR,
    // });

    // const algebraHourDatas = useMemo(() => {
    //     if (!algebraIndexerHourDatas) return null;
    //     return algebraIndexerHourDatas.dexHourDatas.map((d) => ({
    //         ...d,
    //         date: d.periodStartUnix,
    //     }));
    // }, [algebraIndexerHourDatas]);

    const algebraDayDatas = useMemo(() => {
        if (!algebraIndexerDayDatas) return [];
        return algebraIndexerDayDatas.algebraDayDatas;
    }, [algebraIndexerDayDatas]);

    const chartData = useMemo(() => {
        if (!algebraDayDatas) return [];

        return algebraDayDatas
            .filter(isDefined)
            .map((v) => ({
                time: Math.floor(v.date) as UTCTimestamp,
                value: Number(v[selector]),
            }))
            .slice(1);
    }, [algebraDayDatas, selector]);

    return (
        <Chart
            chartData={chartData}
            chartView={chartView}
            chartTitle={title}
            chartSpan={span}
            setChartSpan={setSpan}
            chartType={type}
            setChartType={setType}
            showTypeSelector={showTypeSelector}
            height={height}
            isChartDataLoading={isAlgebraIndexerDayDatasLoading}
        />
    );
}

export function DexCharts() {
    const { infoClient } = useClients();
    const now = useMemo(() => Math.floor(Date.now() / 1000), []);

    const { data } = useAlgebraDayDatasQuery({
        variables: {
            from: now - UNIX_TIMESTAMPS[CHART_SPAN.MONTH],
            to: now,
        },
        client: infoClient,
    });

    const { currentTVL, currentVolume24H, currentFees24H } = useMemo(() => {
        if (!data?.algebraDayDatas) return {};

        const now = data.algebraDayDatas[data.algebraDayDatas.length - 1];
        const dayAgo = data.algebraDayDatas[data.algebraDayDatas.length - 2];

        if (!now || !dayAgo) return {};

        const nowTvl = Number(now.tvlUSD);
        const dayAgoTvl = Number(dayAgo.tvlUSD);

        const nowVolumeUsd = Number(now.volumeUSD);
        const dayAgoVolumeUsd = Number(dayAgo.volumeUSD);

        const nowFeesUsd = Number(now.feesUSD);
        const dayAgoFeesUsd = Number(dayAgo.feesUSD);

        const currentTVL = {
            value: nowTvl,
            change: getPercentChange(nowTvl, dayAgoTvl),
        };

        const currentVolume24H = {
            value: nowVolumeUsd,
            change: getPercentChange(nowVolumeUsd, dayAgoVolumeUsd),
        };

        const currentFees24H = {
            value: nowFeesUsd,
            change: getPercentChange(nowFeesUsd, dayAgoFeesUsd),
        };

        const currentTxCount = now.txCount;

        return {
            currentTVL,
            currentVolume24H,
            currentFees24H,
            currentTxCount,
        };
    }, [data]);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
                <PageTitle title="Analytics" showSettings={false} />
            </div>
            <TotalStats currentTVL={currentTVL} currentVolume={currentVolume24H} currentFees={currentFees24H} />
            <div className="grid grid-rows-2 gap-3 lg:grid-cols-2 lg:grid-rows-1">
                <div className="rounded-xl border border-card-border bg-card">
                    <ChartComponent
                        now={now}
                        selector={"tvlUSD"}
                        title={"TVL"}
                        chartView={CHART_VIEW.AREA}
                        chartType={CHART_TYPE.TVL}
                        height={180}
                    />
                </div>
                <div className="rounded-xl border border-card-border bg-card">
                    <ChartComponent
                        now={now}
                        selector={"volumeUSD"}
                        title={"Volume"}
                        chartView={CHART_VIEW.AREA}
                        chartType={CHART_TYPE.VOLUME}
                        height={180}
                    />
                </div>
            </div>
        </div>
    );
}

export default DexCharts;
