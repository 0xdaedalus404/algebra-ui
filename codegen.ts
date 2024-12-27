import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "https://api.studio.thegraph.com/query/50593/clamm-analytics/v0.0.1",
    "https://api.studio.thegraph.com/query/50593/clamm-blocks/v0.0.1",
    "https://api.studio.thegraph.com/query/50593/clamm-farms/v0.0.1",
    "https://api.studio.thegraph.com/query/50593/clamm-limits/v0.0.2",
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
