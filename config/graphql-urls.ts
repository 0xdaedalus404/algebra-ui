import { ChainId } from "@cryptoalgebra/custom-pools-sdk";

export const INFO_GRAPH_URL = {
    [ChainId.Base]:
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/5pwQHNUqE7GFeG7C32m2HM3vhXvoQpet4HAinmHFmxW5",
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/base-testnet-info/version/latest",
};

export const LIMIT_ORDERS_GRAPH_URL = {
    [ChainId.Base]: "https://api.studio.thegraph.com/query/50593/clamm-limits/v1.2.3",
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/base-testnet-limits/v0.0.5",
};

export const BLOCKS_GRAPH_URL = {
    [ChainId.Base]:
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/2whZiGiG7bRKgZcgvetHFrmJ59Z82SngfgorUcoqksJm",
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/base-testnet-blocks/version/latest",
};

export const FARMING_GRAPH_URL = {
    [ChainId.Base]:
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/5ASqXjxabMNbiqXML7YBMDR7QVRgU6oFe5R8sYi4Uwtn",
    [ChainId.BaseSepolia]: "https://api.studio.thegraph.com/query/50593/base-testnet-farms/version/latest",
};
