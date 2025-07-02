import { useTokenDayDatasQuery, useTokenHourDatasQuery } from "@/graphql/generated/graphql";
import { useClients } from "@/hooks/graphql/useClients";
import { CHART_SPAN, CHART_TYPE, ChartSpanType, PoolChartTypeType } from "@/types/swap-chart";
import { UNIX_TIMESTAMPS, isDefined } from "@/utils";
import { gql } from "@apollo/client";
import { USE_UNISWAP_PLACEHOLDER_DATA } from "config/graphql-urls";
import { UTCTimestamp } from "lightweight-charts";
import { useMemo } from "react";
import useSWR from "swr";

type UniswapTokenAddress = string;
type IntegralTokenAddress = string;

const mainnetTokensMapping: Record<IntegralTokenAddress, UniswapTokenAddress> = {
    "0x4200000000000000000000000000000000000006": "0x4200000000000000000000000000000000000006", // ETH
    "0xabac6f23fdf1313fc2e9c9244f666157ccd32990": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
};

const now = Math.floor(Date.now() / 1000);

const values = {
    [CHART_TYPE.TVL]: "totalValueLockedUSD",
    [CHART_TYPE.VOLUME]: "volumeUSD",
    [CHART_TYPE.FEES]: "feesUSD",
    [CHART_TYPE.PRICE]: "priceUSD",
} as const;

function useUniswapTokenDatasQuery({
    variables,
    skip,
    span,
}: {
    variables: { from: number; to: number; token: string };
    skip: boolean;
    span: "Hour" | "Day";
}) {
    const { uniswapInfoClient } = useClients();

    return useSWR([`uniswapToken${span}Query`, variables, skip], () => {
        if (skip) return null;
        return uniswapInfoClient.query<any>({
            query: gql`
                query Token${span}Datas($token: String!, $from: Int!, $to: Int!) {
                    token${span}Datas(orderBy: date, orderDirection: asc, where: { token: $token, date_gt: $from, date_lt: $to }) {
                        date
                        token {
                            id
                            symbol
                            name
                            decimals
                            derivedNative
                            volumeUSD
                            totalValueLockedUSD
                            feesUSD
                            txCount
                        }
                        feesUSD
                        totalValueLockedUSD
                        volumeUSD
                        id
                        date
                        priceUSD
                        totalValueLocked
                    }
                }
            `,
            variables,
        });
    });
}

export function useTokenChartData(tokenId: string | undefined, span: ChartSpanType, chartType: PoolChartTypeType) {
    const { infoClient } = useClients();

    const { data: tokenIndexerDayDatas, loading: isTokenIndexerDayDatasLoading } = useTokenDayDatasQuery({
        variables: {
            token: tokenId?.toLowerCase() || "",
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * (span === CHART_SPAN.DAY ? 2 : 1),
            to: now,
        },
        client: infoClient,
        skip: USE_UNISWAP_PLACEHOLDER_DATA || !tokenId || span === CHART_SPAN.DAY || span === CHART_SPAN.WEEK,
    });

    const { data: tokenIndexerHourDatas, loading: isTokenIndexerHourDatasLoading } = useTokenHourDatasQuery({
        variables: {
            token: tokenId?.toLowerCase() || "",
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY],
            to: now,
        },
        client: infoClient,
        skip:
            USE_UNISWAP_PLACEHOLDER_DATA ||
            !tokenId ||
            span === CHART_SPAN.MONTH ||
            span === CHART_SPAN.THREE_MONTH ||
            span === CHART_SPAN.YEAR,
    });

    const { data: uniswapIndexerDayDatas, isLoading: isUniswapIndexerDayDatasLoading } = useUniswapTokenDatasQuery({
        variables: {
            token: mainnetTokensMapping[tokenId?.toLowerCase() || ""].toLowerCase(),
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * 2,
            to: now,
        },
        skip: !USE_UNISWAP_PLACEHOLDER_DATA || !tokenId || span === CHART_SPAN.DAY || span === CHART_SPAN.WEEK,
        span: "Day",
    });

    const { data: uniswapIndexerHourDatas, isLoading: isUniswapIndexerHourDatasLoading } = useUniswapTokenDatasQuery({
        variables: {
            token: mainnetTokensMapping[tokenId?.toLowerCase() || ""].toLowerCase(),
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * 2,
            to: now,
        },
        skip:
            !USE_UNISWAP_PLACEHOLDER_DATA ||
            !tokenId ||
            span === CHART_SPAN.MONTH ||
            span === CHART_SPAN.THREE_MONTH ||
            span === CHART_SPAN.YEAR,
        span: "Hour",
    });

    const tokenHourDatas = useMemo(() => {
        if (!tokenIndexerHourDatas) return null;
        const _tokenHourDatas = USE_UNISWAP_PLACEHOLDER_DATA ? uniswapIndexerHourDatas?.data : tokenIndexerHourDatas;
        return _tokenHourDatas.tokenHourDatas.map((d) => ({
            ...d,
            date: d.periodStartUnix,
        }));
    }, [tokenIndexerHourDatas, uniswapIndexerHourDatas?.data]);

    const tokenDayDatas = useMemo(() => {
        if (!tokenIndexerDayDatas) return [];
        const _tokenDayDatas = USE_UNISWAP_PLACEHOLDER_DATA ? uniswapIndexerDayDatas?.data : tokenIndexerDayDatas;
        return _tokenDayDatas.tokenDayDatas;
    }, [tokenIndexerDayDatas, uniswapIndexerDayDatas?.data]);

    const chartData = useMemo(() => {
        const poolDatas = span === CHART_SPAN.DAY ? tokenHourDatas : span === CHART_SPAN.WEEK ? tokenHourDatas : tokenDayDatas;

        if (!poolDatas?.[0]) return [];

        const value = values[chartType];

        const formattedData = poolDatas.filter(isDefined).map((v) => {
            return {
                time: v?.date as UTCTimestamp,
                value: Number(v[value]),
            };
        });

        return formattedData.slice(1);
    }, [tokenDayDatas, tokenHourDatas, span, chartType]);

    return {
        tokenDayDatas,
        tokenHourDatas,
        chartData: chartData,
        loading:
            isTokenIndexerDayDatasLoading ||
            isTokenIndexerHourDatasLoading ||
            isUniswapIndexerDayDatasLoading ||
            isUniswapIndexerHourDatasLoading,
    };
}
