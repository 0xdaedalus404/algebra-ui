import { useDerivedSwapInfo } from "@/state/swapStore";
import CurrencyLogo from "@/components/common/CurrencyLogo";
import { Button } from "@/components/ui/button";
import { truncateHash } from "@/utils";
import { BarChart3Icon } from "lucide-react";

const SwapChart = () => {
    const { currencies } = useDerivedSwapInfo();

    const [tokenA, tokenB] = [currencies.INPUT?.wrapped, currencies.OUTPUT?.wrapped];

    return (
        <div className="flex flex-col p-6 gap-6 w-full h-full max-h-[362px] relative rounded-xl bg-card">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-xl font-semibold">
                    <CurrencyLogo currency={tokenA} size={42} />
                    <CurrencyLogo className="-ml-6" currency={tokenB} size={42} />
                    {tokenA?.symbol} / {tokenB?.symbol}
                </div>
                <div className="flex flex-col text-sm font-semibold">
                    <span className="flex items-center gap-2">
                        {tokenA?.symbol}
                        <Button className="h-fit w-fit" variant={"link"} size={"sm"}>
                            {truncateHash(tokenA?.address)}
                        </Button>
                    </span>
                    <span className="flex items-center gap-2">
                        {tokenB?.symbol}
                        <Button className="h-fit w-fit" variant={"link"} size={"sm"}>
                            {truncateHash(tokenB?.address)}
                        </Button>
                    </span>
                </div>
            </div>
            <hr className="border" />
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                <BarChart3Icon size={42} />
                Chart coming soon...
            </div>
        </div>
    );
};

export default SwapChart;
