import SwapPair from "@/components/swap/SwapPair";
import SwapButton from "@/components/swap/SwapButton";
import SwapParams from "@/components/swap/SwapParams";
import PageContainer from "@/components/common/PageContainer";
import PoweredByAlgebra from "@/components/common/PoweredByAlgebra";
import { useDerivedSwapInfo } from "@/state/swapStore.ts";
import { SwapPageProps, SwapPageView } from "./types";
import PageTitle from "@/components/common/PageTitle";
import SwapChart from "@/components/swap/SwapChart";

import LimitOrdersModule from "@/modules/LimitOrdersModule";
const { LimitOrder, SwapTypeSelector, LimitOrdersList } = LimitOrdersModule.components;

import SmartRouterModule from "@/modules/SmartRouterModule";
import { enabledModules } from "config/app-modules";
import { TradeState } from "@/types/trade-state";
const { useSmartRouterBestRoute } = SmartRouterModule.hooks;

const SwapPage = ({ type }: SwapPageProps) => {
    const isLimitOrder = type === SwapPageView.LIMIT_ORDER;

    const derivedSwap = useDerivedSwapInfo();

    const smartTrade = useSmartRouterBestRoute(
        derivedSwap.parsedAmount,
        derivedSwap.isExactIn ? derivedSwap.currencies.OUTPUT : derivedSwap.currencies.INPUT,
        derivedSwap.isExactIn,
        true
    );

    return (
        <PageContainer>
            <div className="grid grid-flow-col max-md:flex max-md:flex-col-reverse auto-cols-fr w-full gap-3 mb-3">
                <SwapTypeSelector isLimitOrder={isLimitOrder} />
                <div className="col-span-2">
                    <PageTitle title={"Trade"} showSettings={true} />
                </div>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-3 mb-3">
                <div className="flex flex-col gap-2 col-span-1">
                    <div className="flex flex-col gap-1 col-span-1 w-full bg-card border border-card-border p-2 rounded-xl">
                        <SwapPair
                            derivedSwap={derivedSwap}
                            trade={enabledModules.smartRouter ? smartTrade.trade?.bestTrade : derivedSwap.toggledTrade}
                            isTradeLoading={smartTrade.isLoading || derivedSwap.tradeState.state === TradeState.LOADING}
                        />
                        {isLimitOrder ? (
                            <LimitOrder />
                        ) : (
                            <SwapParams
                                derivedSwap={derivedSwap}
                                trade={enabledModules.smartRouter ? smartTrade.trade?.bestTrade : derivedSwap.toggledTrade}
                                isTradeLoading={smartTrade.isLoading || derivedSwap.tradeState.state === TradeState.LOADING}
                            />
                        )}
                        {!isLimitOrder && (
                            <SwapButton
                                derivedSwap={derivedSwap}
                                trade={enabledModules.smartRouter ? smartTrade.trade?.bestTrade : derivedSwap.toggledTrade}
                                isTradeLoading={smartTrade.isLoading || derivedSwap.tradeState.state === TradeState.LOADING}
                                smartTradeCallOptions={{
                                    calldata: smartTrade.trade?.calldata,
                                    value: smartTrade.trade?.value,
                                }}
                            />
                        )}
                    </div>
                    <PoweredByAlgebra />
                </div>
                <div className="flex flex-col gap-3 col-span-2 max-h-[514px]">
                    <SwapChart />
                </div>
            </div>
            {isLimitOrder && <LimitOrdersList />}
        </PageContainer>
    );
};

export default SwapPage;
