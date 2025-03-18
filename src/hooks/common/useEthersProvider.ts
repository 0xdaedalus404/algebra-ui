import { providers } from "ethers";
import { useMemo } from "react";
import useSWR from "swr";
import type { Chain, Client, Transport } from "viem";
import { usePublicClient, WalletClient } from "wagmi";
import { getWalletClient } from "wagmi/actions";

export function clientToProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    if (transport.type === "fallback")
        return new providers.FallbackProvider(
            (transport.transports as ReturnType<Transport>[]).map(({ value }) => new providers.JsonRpcProvider(value?.url, network))
        );
    return new providers.JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
    const client = usePublicClient({ chainId });

    return useMemo(() => {
        return clientToProvider(client);
    }, [client]);
}

export function walletToProvider(walletClient: WalletClient) {
    const { chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    return provider;
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: provider } = useSWR(["ethersProvider", chainId], async () => {
        const client = await getWalletClient({ chainId });
        if (!client) throw new Error("No wallet client");
        return walletToProvider(client);
    });

    return provider;
}
