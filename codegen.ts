import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "https://query.kakarot.protofire.io/subgraphs/name/kakarot/algebra-analytics",
    "https://query.kakarot.protofire.io/subgraphs/name/kakarot/blocks",
    "https://query.kakarot.protofire.io/subgraphs/name/kakarot/algebra-farms",
    "https://query.kakarot.protofire.io/subgraphs/name/kakarot/limit-orders",
  ],
  documents: "src/graphql/queries/!(*.d).{ts,tsx}",
  generates: {
    "src/graphql/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withResultType: true,
      },
    },
  },
};

export default config;
