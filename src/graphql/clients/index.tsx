import { ApolloClient, InMemoryCache } from "@apollo/client";

export const infoClient = new ApolloClient({
    uri: import.meta.env.VITE_INFO_GRAPH,
    cache: new InMemoryCache(),
});

export const limitOrderClient = new ApolloClient({
    uri: import.meta.env.VITE_LIMIT_ORDERS_GRAPH,
    cache: new InMemoryCache(),
});

export const blocksClient = new ApolloClient({
    uri: import.meta.env.VITE_BLOCKS_GRAPH,
    cache: new InMemoryCache(),
});

export const farmingClient = new ApolloClient({
    uri: import.meta.env.VITE_FARMING_GRAPH,
    cache: new InMemoryCache(),
});

export const infoClientTestnet = new ApolloClient({
    uri: import.meta.env.VITE_INFO_GRAPH_TESTNET,
    cache: new InMemoryCache(),
});

export const blocksClientTestnet = new ApolloClient({
    uri: import.meta.env.VITE_BLOCKS_GRAPH_TESTNET,
    cache: new InMemoryCache(),
});

export const farmingClientTestnet = new ApolloClient({
    uri: import.meta.env.VITE_FARMING_GRAPH_TESTNET,
    cache: new InMemoryCache(),
});
