import {
    infoClient,
    blocksClient,
    farmingClient,
    limitOrderClient,
    infoClientTestnet,
    blocksClientTestnet,
    farmingClientTestnet,
} from "@/graphql/clients";
import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { useChainId } from "wagmi";

export function useClients() {
    const chainId = useChainId();

    switch (chainId) {
        case ChainId.Base:
            return {
                infoClient,
                blocksClient,
                farmingClient,
                limitOrderClient,
            };
        case ChainId.BaseSepolia:
            return {
                infoClient: infoClientTestnet,
                blocksClient: blocksClientTestnet,
                farmingClient: farmingClientTestnet,
            };
        default:
            return {
                infoClient,
                blocksClient,
                farmingClient,
                limitOrderClient,
            };
    }
}
