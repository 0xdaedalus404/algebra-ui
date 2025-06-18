import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { INFO_GRAPH_URL, LIMIT_ORDERS_GRAPH_URL, BLOCKS_GRAPH_URL, FARMING_GRAPH_URL } from "./config/graphql-urls";
import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
    overwrite: true,
    schema: [
        INFO_GRAPH_URL[ChainId.Base],
        LIMIT_ORDERS_GRAPH_URL[ChainId.Base],
        BLOCKS_GRAPH_URL[ChainId.Base],
        FARMING_GRAPH_URL[ChainId.Base],
    ],
    documents: "src/graphql/queries/!(*.d).{ts,tsx}",
    generates: {
        "src/graphql/generated/graphql.tsx": {
            plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
            config: {
                withHooks: true,
                withResultType: true,
            },
        },
    },
};

export default config;
