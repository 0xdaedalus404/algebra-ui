import React from "react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider as _WagmiProvider } from "wagmi";
import { AppKitNetwork, baseSepolia } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID;

const queryClient = new QueryClient();

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia];

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId: PROJECT_ID,
    ssr: true,
});

createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId: PROJECT_ID,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

export default function WagmiProvider({ children }: { children: React.ReactNode }) {
    return (
        <_WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </_WagmiProvider>
    );
}
