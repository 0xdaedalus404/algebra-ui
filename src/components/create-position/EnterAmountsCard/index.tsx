import CurrencyLogo from "@/components/common/CurrencyLogo";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/utils";
import { Currency } from "@cryptoalgebra/custom-pools-sdk";
import { useCallback, useMemo } from "react";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

interface EnterAmountsCardProps {
    currency: Currency | undefined;
    value: string;
    handleChange: (value: string) => void;
}

const EnterAmountCard = ({ currency, value, handleChange }: EnterAmountsCardProps) => {
    const { address: account } = useAccount();

    const { data: balance, isLoading } = useBalance({
        address: account,
        token: currency?.isNative ? undefined : (currency?.wrapped.address as Address),
    });

    const balanceString = useMemo(() => {
        if (isLoading || !balance) return "Loading...";

        return formatAmount(balance.formatted);
    }, [balance, isLoading]);

    const handleInput = useCallback((value: string) => {
        if (value === ".") value = "0.";
        handleChange(value);
    }, []);

    function setMax() {
        handleChange(balance?.formatted || "0");
    }

    return (
        <div className="flex w-full bg-card-dark p-3 rounded-lg">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <CurrencyLogo currency={currency} size={35} />
                    <span className="font-bold text-lg">{currency ? currency.symbol : "Select a token"}</span>
                </div>
                {currency && account && (
                    <div className={"flex text-sm whitespace-nowrap"}>
                        <div>
                            <span className="font-semibold">Balance: </span>
                            <span>{balanceString}</span>
                        </div>
                        <button className="ml-2 text-[#63b4ff]" onClick={setMax}>
                            Max
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end w-full">
                <Input
                    value={value}
                    id={`amount-${currency?.symbol}`}
                    onUserInput={(v) => handleInput(v)}
                    className={`text-right border-none text-xl font-bold w-9/12 p-0 ring-0!`}
                    placeholder={"0.0"}
                    maxDecimals={currency?.decimals}
                />
                {/* <div className="text-sm">{fiatValue && formatUSD.format(fiatValue)}</div> */}
            </div>
        </div>
    );
};

export default EnterAmountCard;
