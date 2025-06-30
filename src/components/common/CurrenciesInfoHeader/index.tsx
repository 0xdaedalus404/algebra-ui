import { ADDRESS_ZERO, Currency } from "@cryptoalgebra/custom-pools-sdk";
import CurrencyLogo from "../CurrencyLogo";
import { truncateHash } from "@/utils";
import { Button } from "@/components/ui/button";
import { Address } from "viem";

export function CurrenciesInfoHeader({ tokenA, tokenB }: { tokenA: Currency | undefined; tokenB: Currency | undefined | null }) {
    if (tokenB === null)
        return (
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-xl font-semibold">
                    <CurrencyLogo currency={tokenA} size={42} />
                    <div className="flex flex-col gap-0 items-start">
                        <span className="font-semibold">{tokenA?.symbol}</span>
                        <span className="text-sm font-semibold">{tokenA?.name}</span>
                    </div>
                </div>
                <span className="flex items-center gap-2 text-sm font-semibold">
                    {tokenA?.symbol}
                    <Button className="h-fit w-fit" variant={"link"} size={"sm"}>
                        {truncateHash((tokenA?.wrapped.address as Address) || ADDRESS_ZERO)}
                    </Button>
                </span>
            </div>
        );

    return (
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
                        {truncateHash((tokenA?.wrapped.address as Address) || ADDRESS_ZERO)}
                    </Button>
                </span>
                <span className="flex items-center gap-2">
                    {tokenB?.symbol}
                    <Button className="h-fit w-fit" variant={"link"} size={"sm"}>
                        {truncateHash((tokenB?.wrapped.address as Address) || ADDRESS_ZERO)}
                    </Button>
                </span>
            </div>
        </div>
    );
}
