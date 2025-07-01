import { ChainId } from "@cryptoalgebra/custom-pools-sdk";

export const INFO_GRAPH_URL = {
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/integral-v12/v1.0.0",
};

export const LIMIT_ORDERS_GRAPH_URL = {
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/limit-orders/v0.0.1",
};

export const BLOCKS_GRAPH_URL = {
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/base-testnet-blocks/version/latest",
};

export const FARMING_GRAPH_URL = {
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/integral-v12-farming/v1.0.0",
};
