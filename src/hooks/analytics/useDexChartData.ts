import { useAlgebraDayDatasQuery, useAlgebraHourDatasQuery } from "@/graphql/generated/graphql";
import { useClients } from "@/hooks/graphql/useClients";
import { CHART_SPAN, ChartSpanType } from "@/types/swap-chart";
import { UNIX_TIMESTAMPS, isDefined } from "@/utils";
import { gql } from "@apollo/client";
import { USE_UNISWAP_PLACEHOLDER_DATA } from "config/graphql-urls";
import { UTCTimestamp } from "lightweight-charts";
import { useMemo } from "react";
import useSWR from "swr";

const now = Math.floor(Date.now() / 1000);

function useUniswapDayDatasQuery({ variables, skip }: { variables: { from: number; to: number }; skip: boolean }) {
    const { uniswapInfoClient } = useClients();

    return useSWR(["uniswapDayDatas", variables, skip], () => {
        if (skip) return null;
        return uniswapInfoClient.query<any>({
            query: gql`
                query UniswapDayDatas($from: Int!, $to: Int!) {
                    uniswapDayDatas(orderBy: date, orderDirection: desc, where: { date_gt: $from, date_lt: $to }) {
                        tvlUSD
                        txCount
                        volumeUSD
                        id
                        feesUSD
                        date
                    }
                }
            `,
            variables,
        });
    });
}

export function useDexChartData(span: ChartSpanType, selector: "tvlUSD" | "volumeUSD" = "tvlUSD") {
    const { infoClient } = useClients();

    const { data: algebraIndexerDayDatas, loading: isAlgebraIndexerDayDatasLoading } = useAlgebraDayDatasQuery({
        variables: {
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * 2,
            to: now,
        },
        client: infoClient,
        skip: USE_UNISWAP_PLACEHOLDER_DATA || span === CHART_SPAN.DAY || span === CHART_SPAN.WEEK,
    });

    const { data: algebraIndexerHourDatas, loading: isAlgebraIndexerHourDatasLoading } = useAlgebraHourDatasQuery({
        variables: {
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY],
            to: now,
        },
        client: infoClient,
        skip: USE_UNISWAP_PLACEHOLDER_DATA || span === CHART_SPAN.MONTH || span === CHART_SPAN.THREE_MONTH || span === CHART_SPAN.YEAR,
    });

    const { data: uniswapIndexerDayDatas, isLoading: isUniswapIndexerDayDatasLoading } = useUniswapDayDatasQuery({
        variables: {
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * 2,
            to: now,
        },
        skip: !USE_UNISWAP_PLACEHOLDER_DATA,
    });

    const dexHourDatas = useMemo(() => {
        return USE_UNISWAP_PLACEHOLDER_DATA
            ? uniswapIndexerDayDatas?.data.uniswapDayDatas || []
            : algebraIndexerHourDatas?.algebraHourDatas || [];
    }, [algebraIndexerHourDatas, uniswapIndexerDayDatas]);

    const dexDayDatas = useMemo(() => {
        return USE_UNISWAP_PLACEHOLDER_DATA
            ? uniswapIndexerDayDatas?.data.uniswapDayDatas || []
            : algebraIndexerDayDatas?.algebraDayDatas || [];
    }, [algebraIndexerDayDatas, uniswapIndexerDayDatas]);

    const chartData = useMemo(() => {
        const poolDatas = span === CHART_SPAN.DAY ? dexHourDatas : span === CHART_SPAN.WEEK ? dexHourDatas : dexDayDatas;
        if (!poolDatas) return [];

        return dexDayDatas
            .filter(isDefined)
            .map((v) => ({
                time: Math.floor(v.date) as UTCTimestamp,
                value: Number(v[selector]),
            }))
            .slice(1);
    }, [dexDayDatas, dexHourDatas, selector, span]);

    return {
        dexHourDatas,
        dexDayDatas,
        chartData: chartData,
        loading: isAlgebraIndexerDayDatasLoading || isAlgebraIndexerHourDatasLoading || isUniswapIndexerDayDatasLoading,
    };
}
