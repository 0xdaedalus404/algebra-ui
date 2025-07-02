import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createApolloClient = (uri: string, apiKey?: string) =>
    new ApolloClient({ uri, cache: new InMemoryCache(), headers: { Authorization: `Bearer ${apiKey}` } });
