import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { createApolloClient } from "../utils/createApolloClient";
import { INFO_GRAPH_URL, LIMIT_ORDERS_GRAPH_URL, BLOCKS_GRAPH_URL, FARMING_GRAPH_URL } from "config/graphql-urls";

export const infoClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
    [ChainId.Base]: createApolloClient(INFO_GRAPH_URL[ChainId.Base]),
    [ChainId.BaseSepolia]: createApolloClient(INFO_GRAPH_URL[ChainId.BaseSepolia]),
};

export const limitOrderClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
    [ChainId.Base]: createApolloClient(LIMIT_ORDERS_GRAPH_URL[ChainId.Base]),
    [ChainId.BaseSepolia]: createApolloClient(LIMIT_ORDERS_GRAPH_URL[ChainId.BaseSepolia]),
};

export const blocksClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
    [ChainId.Base]: createApolloClient(BLOCKS_GRAPH_URL[ChainId.Base]),
    [ChainId.BaseSepolia]: createApolloClient(BLOCKS_GRAPH_URL[ChainId.BaseSepolia]),
};

export const farmingClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
    [ChainId.Base]: createApolloClient(FARMING_GRAPH_URL[ChainId.Base]),
    [ChainId.BaseSepolia]: createApolloClient(FARMING_GRAPH_URL[ChainId.BaseSepolia]),
};
