import SwapPair from "@/components/swap/SwapPair";
import SwapButton from "@/components/swap/SwapButton";
import SwapParams from "@/components/swap/SwapParams";
import PageContainer from "@/components/common/PageContainer";
import PageTitle from "@/components/common/PageTitle";
import PoweredByAlgebra from "@/components/common/PoweredByAlgebra";
import { useDerivedSwapInfo } from "@/state/swapStore.ts";
import { useSmartRouterBestRoute } from "@/hooks/routing/useSmartRouterBestRoute.ts";
import { Currency as CurrencyBN } from "@cryptoalgebra/router-custom-pools-and-sliding-fee";
import { useAccount } from "wagmi";
import { SwapPageProps, SwapPageView } from "./types";
import LimitOrder from "@/components/limit-orders/LimitOrder";
import LimitOrdersList from "@/components/limit-orders/LimitOrdersList";

const SwapPage = ({ type }: SwapPageProps) => {
    const { address: account } = useAccount();

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
            <PageTitle title={isLimitOrder ? "Limit Order" : "Swap"} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-0 gap-y-8 w-full lg:gap-8 mt-8 lg:mt-16">
                <div className="flex flex-col gap-2">
                    {/* <IntegralPools /> */}

                    <div className="flex flex-col gap-1 w-full bg-card border border-card-border p-2 rounded-3xl">
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

                <div className="col-span-2">{/* <SwapChart /> */}</div>
            </div>

            {isLimitOrder && account && (
                <div className="w-full mt-12">
                    <LimitOrdersList />
                </div>
            )}
        </PageContainer>
    );
};

export default SwapPage;
