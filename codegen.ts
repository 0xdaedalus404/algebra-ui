import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: [
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/5pwQHNUqE7GFeG7C32m2HM3vhXvoQpet4HAinmHFmxW5",
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/5ASqXjxabMNbiqXML7YBMDR7QVRgU6oFe5R8sYi4Uwtn",
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/2whZiGiG7bRKgZcgvetHFrmJ59Z82SngfgorUcoqksJm",
        "https://gateway.thegraph.com/api/4d7b59e4fd14365ae609945af85f3938/subgraphs/id/3dGcgzyDKZHZK8ykeyguecQwamriG6nQpDWCs8j9PiAS",
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
