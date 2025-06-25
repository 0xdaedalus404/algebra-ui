import SwapPair from "@/components/swap/SwapPair";
import SwapButton from "@/components/swap/SwapButton";
import SwapParams from "@/components/swap/SwapParams";
import PageContainer from "@/components/common/PageContainer";
import PoweredByAlgebra from "@/components/common/PoweredByAlgebra";
import { useDerivedSwapInfo } from "@/state/swapStore.ts";
import { useSmartRouterBestRoute } from "@/hooks/routing/useSmartRouterBestRoute.ts";
import { Currency as CurrencyBN } from "@cryptoalgebra/router-custom-pools-and-sliding-fee";
import { SwapPageProps, SwapPageView } from "./types";
import LimitOrdersModule from "@/modules/LimitOrdersModule";

import PageTitle from "@/components/common/PageTitle";
import SwapChart from "@/components/swap/SwapChart";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const { LimitOrder } = LimitOrdersModule.components;

const SwapPage = ({ type }: SwapPageProps) => {
    const isLimitOrder = type === SwapPageView.LIMIT_ORDER;

    const derivedSwap = useDerivedSwapInfo();

    const smartTrade = useSmartRouterBestRoute(
        derivedSwap.parsedAmountBN,
        (derivedSwap.isExactIn ? derivedSwap.currencies.OUTPUT : derivedSwap.currencies.INPUT) as CurrencyBN,
        derivedSwap.isExactIn,
        true
    );

    return (
        <PageContainer>
            <div className="grid grid-cols-3 w-full gap-3 mt-16 mb-3">
                <div className="grid grid-cols-2 h-full col-span-1 max-h-16 p-2 bg-card rounded-xl gap-2">
                    <NavLink className="w-full h-full" to="/swap">
                        <Button
                            size={"sm"}
                            variant={isLimitOrder ? "ghost" : "ghostActive"}
                            className="flex items-center justify-center gap-2 w-full rounded-lg h-12"
                        >
                            Swap
                        </Button>
                    </NavLink>
                    <NavLink className={"w-full h-full"} to="/limit-order">
                        <Button
                            size={"sm"}
                            variant={isLimitOrder ? "ghostActive" : "ghost"}
                            className="flex items-center justify-center gap-2 w-full rounded-lg h-12"
                        >
                            Limit
                        </Button>
                    </NavLink>
                </div>
                <div className="col-span-2">
                    <PageTitle title={"Trade"} showSettings={true} />
                </div>
            </div>
            <div className="grid grid-cols-3 w-full gap-3">
                <div className="flex flex-col gap-2 col-span-1">
                    <div className="flex flex-col gap-1 col-span-1 w-full bg-card border border-card-border p-2 rounded-xl">
                        <SwapPair derivedSwap={derivedSwap} smartTrade={smartTrade.trade?.bestTrade} />
                        {isLimitOrder ? (
                            <LimitOrder />
                        ) : (
                            <SwapParams
                                derivedSwap={derivedSwap}
                                smartTrade={smartTrade.trade?.bestTrade}
                                isSmartTradeLoading={smartTrade.isLoading}
                            />
                        )}
                        {!isLimitOrder && (
                            <SwapButton
                                derivedSwap={derivedSwap}
                                smartTrade={smartTrade.trade?.bestTrade}
                                isSmartTradeLoading={smartTrade.isLoading}
                                callOptions={{
                                    calldata: smartTrade.trade?.calldata,
                                    value: smartTrade.trade?.value,
                                }}
                            />
                        )}
                    </div>
                    <PoweredByAlgebra />
                </div>
                <div className="flex flex-col gap-3 col-span-2">
                    <SwapChart />
                </div>
            </div>
        </PageContainer>
    );
};

export default SwapPage;
