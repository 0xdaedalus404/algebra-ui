import { useLayoutEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CHART_SPAN, CHART_TYPE, CHART_VIEW, ChartSpanType, PoolChartTypeType } from "../../types";
import { isDefined } from "@/utils/common/isDefined";
import { getPercentChange, UNIX_TIMESTAMPS } from "../../utils";
import { UTCTimestamp } from "lightweight-charts";
import { useTokenDayDatasQuery, useTokenHourDatasQuery } from "@/graphql/generated/graphql";
import { Address } from "viem";
import { Chart } from "../Chart";
import { useClients } from "@/hooks/graphql/useClients";
import PageTitle from "@/components/common/PageTitle";
import { CurrenciesInfoHeader } from "@/components/common/CurrenciesInfoHeader";
import { formatAmount, formatPercent } from "@/utils";
import { Currency } from "@cryptoalgebra/custom-pools-sdk";
import CurrencyLogo from "@/components/common/CurrencyLogo";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Plus } from "lucide-react";
import { TransactionsList } from "../TransactionsList";
import PoolsList from "@/components/pools/PoolsList";
import { useCurrency } from "@/hooks/common/useCurrency";

const values = {
    [CHART_TYPE.TVL]: "totalValueLockedUSD",
    [CHART_TYPE.VOLUME]: "volumeUSD",
    [CHART_TYPE.FEES]: "feesUSD",
    [CHART_TYPE.PRICE]: "priceUSD",
} as const;

const LiquidityStats = ({
    token0,
    statistics,
}: {
    token0: Currency | undefined;
    statistics:
        | {
              volume24H: string;
              fees24H: string;
              tvlUSD: string;
              tvl: string;
              tvlPercentChange: number;
              volumePercentChange: number;
              feesPercentChange: number;
              txCount: string;
              priceUSD: string;
          }
        | undefined;
}) => {
    return (
        <div className="flex flex-col gap-3 h-fit">
            <div className="flex flex-col w-full items-start bg-card rounded-xl border border-card-border p-6 h-fit">
                <h2 className="font-semibold mb-2">Price</h2>
                <p className="text-2xl font-bold mb-3">${formatAmount(statistics?.priceUSD || 0, 4)}</p>
                <h2 className="font-semibold mb-2">Liquidity</h2>
                <p className="text-2xl font-bold mb-3">${formatAmount(statistics?.tvlUSD || 0, 4)}</p>
                <div className="flex flex-col gap-3 items-start w-full">
                    <h3 className="text-text-100/50">Total Value Locked</h3>
                    <div className="flex items-center w-full justify-between">
                        <div className="flex items-center gap-2">
                            <CurrencyLogo currency={token0} size={24} />
                            <span>{token0?.symbol}</span>
                        </div>
                        <span className="font-semibold">{formatAmount(statistics?.tvl || 0, 4)}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full items-start bg-card border border-card-border rounded-xl p-6 h-fit">
                <h2 className="font-semibold mb-4">Statistics</h2>
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between">
                        <span className="text-text-100/50">Liquidity</span>
                        <span className="font-semibold">
                            ${formatAmount(statistics?.tvlUSD || 0, 2)}{" "}
                            <span className={`text-sm ${(statistics?.tvlPercentChange || 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                                <span>{(statistics?.tvlPercentChange || 0) > 0 ? "+" : ""}</span>
                                <span>{formatPercent.format((statistics?.tvlPercentChange || 0) / 100)}</span>
                            </span>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-100/50">Volume (24h)</span>
                        <span className="font-semibold">
                            ${formatAmount(statistics?.volume24H || 0, 2)}{" "}
                            <span className={`text-sm ${(statistics?.volumePercentChange || 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                                <span>{(statistics?.volumePercentChange || 0) > 0 ? "+" : ""}</span>
                                <span>{formatPercent.format((statistics?.volumePercentChange || 0) / 100)}</span>
                            </span>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-100/50">Fees (24h)</span>
                        <span className="font-semibold">
                            ${formatAmount(statistics?.fees24H || 0, 2)}{" "}
                            <span className={`text-sm ${(statistics?.feesPercentChange || 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                                <span>{(statistics?.feesPercentChange || 0) > 0 ? "+" : ""}</span>
                                <span>{formatPercent.format((statistics?.feesPercentChange || 0) / 100)}</span>
                            </span>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-100/50">Transactions</span>
                        <span className="font-semibold">{formatAmount(statistics?.txCount || 0, 2)} </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function AnalyticsTokenPage() {
    const { tokenId } = useParams();
    const { pathname } = useLocation();
    const now = useMemo(() => Math.floor(Date.now() / 1000), []);
    const { infoClient } = useClients();

    const [type, setType] = useState<PoolChartTypeType>(CHART_TYPE.TVL);
    const [span, setSpan] = useState<ChartSpanType>(CHART_SPAN.MONTH);
    const [tableView, setTableView] = useState<"pools" | "transactions">("pools");

    const currency = useCurrency(tokenId as Address);

    const { data: tokenIndexerDayDatas } = useTokenDayDatasQuery({
        variables: {
            token: tokenId!,
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * (span === CHART_SPAN.DAY ? 2 : 1),
            to: now,
        },
        client: infoClient,
        skip: !tokenId,
    });

    const { data: tokenIndexerHourDatas } = useTokenHourDatasQuery({
        variables: {
            token: tokenId!,
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY],
            to: now,
        },
        client: infoClient,
        skip: !tokenId || span === CHART_SPAN.MONTH || span === CHART_SPAN.THREE_MONTH || span === CHART_SPAN.YEAR,
    });

    const tokenHourDatas = useMemo(() => {
        if (!tokenIndexerHourDatas) return null;
        return tokenIndexerHourDatas.tokenHourDatas.map((d) => ({
            ...d,
            date: d.periodStartUnix,
        }));
    }, [tokenIndexerHourDatas]);

    const tokenDayDatas = useMemo(() => {
        if (!tokenIndexerDayDatas) return [];
        return tokenIndexerDayDatas.tokenDayDatas;
    }, [tokenIndexerDayDatas]);

    const statistics = useMemo(() => {
        if (!tokenDayDatas[0]) return undefined;

        const currentTokenData = tokenDayDatas[tokenDayDatas.length - 1];
        const prevTokenData = tokenDayDatas[tokenDayDatas.length - 2];

        return {
            volume24H: currentTokenData.volumeUSD,
            fees24H: currentTokenData.feesUSD,
            tvlUSD: currentTokenData.totalValueLockedUSD,
            tvl: currentTokenData.totalValueLocked,
            tvlPercentChange: getPercentChange(Number(currentTokenData.totalValueLocked), Number(prevTokenData?.totalValueLocked || 0)),
            volumePercentChange: getPercentChange(Number(currentTokenData.volumeUSD), Number(prevTokenData?.volumeUSD || 0)),
            feesPercentChange: getPercentChange(Number(currentTokenData.feesUSD), Number(prevTokenData?.feesUSD || 0)),
            txCount: currentTokenData.token.txCount,
            priceUSD: currentTokenData.priceUSD,
        };
    }, [tokenDayDatas]);

    const chartData = useMemo(() => {
        const poolDatas = span === CHART_SPAN.DAY ? tokenHourDatas : span === CHART_SPAN.WEEK ? tokenHourDatas : tokenDayDatas;

        if (!poolDatas?.[0]) return [];

        const value = values[type];

        const formattedData = poolDatas.filter(isDefined).map((v) => {
            return {
                time: v?.date as UTCTimestamp,
                value: Number(v[value]),
            };
        });

        return formattedData.slice(1);
    }, [tokenDayDatas, tokenHourDatas, span, type]);

    const currentValue = chartData.length ? chartData[chartData.length - 1].value : 0;

    const chartView = useMemo(() => {
        switch (type) {
            case CHART_TYPE.TVL:
                return CHART_VIEW.AREA;
            case CHART_TYPE.VOLUME:
                return CHART_VIEW.BAR;
            case CHART_TYPE.FEES:
                return CHART_VIEW.BAR;
            case CHART_TYPE.PRICE:
                return CHART_VIEW.LINE;
            // case CHART_TYPE.APR:
            //     return CHART_VIEW.LINE;
            default:
                return CHART_VIEW.AREA;
        }
    }, [type]);

    const tables = {
        pools: <PoolsList tokenId={tokenId as Address} isExplore />,
        transactions: <TransactionsList tokenId={tokenId as Address} />,
    };

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex w-full animate-fade-in flex-col gap-3 py-6 max-md:pb-24">
            <PageTitle title="Explore token" showSettings={false} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="md:col-span-2 bg-card border border-card-border rounded-xl p-3">
                    <div className="flex flex-col p-3 gap-6">
                        <CurrenciesInfoHeader tokenA={currency} tokenB={null} />
                        <hr className="border" />
                    </div>

                    <Chart
                        chartData={chartData}
                        chartSpan={span}
                        chartTitle={type}
                        chartView={chartView}
                        chartType={type}
                        setChartType={setType}
                        setChartSpan={setSpan}
                        chartCurrentValue={currentValue}
                        showTypeSelector
                        showAPR
                        height={260}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Link className="col-span-1 w-full" to={"/swap"}>
                            <Button className="gap-2 rounded-xl w-full" variant={"default"} size={"lg"}>
                                <ArrowDownUp size={20} className="text-text-100" />
                                Trade
                            </Button>
                        </Link>
                        <Link className="col-span-1 w-full" to={"/pools"}>
                            <Button
                                className="bg-primary-300 w-full text-bg-100 gap-2 rounded-xl hover:bg-primary-300"
                                variant={"default"}
                                size={"lg"}
                            >
                                Create position
                                <div className="rounded-full p-1 bg-bg-100">
                                    <Plus size={18} className="text-text-100" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                    <LiquidityStats token0={currency} statistics={statistics} />
                </div>
            </div>

            <nav className="w-full text-xl pb-3 border-b my-3">
                <ul className="flex gap-8 whitespace-nowrap">
                    <button
                        type={"button"}
                        onClick={() => setTableView("pools")}
                        className={`select-none font-semibold duration-200 ${
                            tableView === "pools" ? "text-primary-200" : "hover:text-primary-200"
                        }`}
                    >
                        Pools
                    </button>

                    <button
                        type={"button"}
                        onClick={() => setTableView("transactions")}
                        className={`select-none font-semibold duration-200 ${
                            tableView === "transactions" ? "text-primary-200" : "hover:text-primary-200"
                        }`}
                    >
                        Transactions
                    </button>
                </ul>
            </nav>

            <div className="pb-5 bg-card border border-card-border/60 rounded-xl w-full">{tables[tableView]}</div>
        </div>
    );
}
