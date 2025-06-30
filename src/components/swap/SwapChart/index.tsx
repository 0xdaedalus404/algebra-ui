import { useDerivedSwapInfo } from "@/state/swapStore";
import { BarChart3Icon } from "lucide-react";
import { CurrenciesInfoHeader } from "@/components/common/CurrenciesInfoHeader";

const SwapChart = () => {
    const { currencies } = useDerivedSwapInfo();

    const [tokenA, tokenB] = [currencies.INPUT?.wrapped, currencies.OUTPUT?.wrapped];

    return (
        <div className="flex flex-col p-6 gap-6 w-full h-full max-h-[362px] relative rounded-xl bg-card">
            <CurrenciesInfoHeader tokenA={tokenA} tokenB={tokenB} />
            <hr className="border" />
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                <BarChart3Icon size={42} />
                Chart coming soon...
            </div>
        </div>
    );
};

export default SwapChart;
