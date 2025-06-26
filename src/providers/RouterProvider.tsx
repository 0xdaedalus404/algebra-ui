import App from "@/App";
import CreatePoolPage from "@/pages/CreatePool";
import NewPositionPage from "@/pages/NewPosition";
import Page404 from "@/pages/Page404";
import PoolPage from "@/pages/Pool";
import PoolsPage from "@/pages/Pools";
import SwapPage from "@/pages/Swap";
import { SwapPageView } from "@/pages/Swap/types";
import { enabledModules } from "config/modules";
import { createBrowserRouter, Navigate, RouterProvider as _RouterProvider, RouteObject } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate replace to="/swap" />,
        errorElement: <Page404 />,
    },
    {
        element: <App />,
        children: [
            {
                path: "swap",
                element: <SwapPage type={SwapPageView.SWAP} />,
            },
            enabledModules.alm && {
                path: "limit-order",
                element: <SwapPage type={SwapPageView.LIMIT_ORDER} />,
            },
            {
                path: "pools",
                element: <PoolsPage />,
            },
            {
                path: "pools/create",
                element: <CreatePoolPage />,
            },
            {
                path: "pool/:pool",
                element: <PoolPage />,
            },
            {
                path: "pool/:pool/new-position",
                element: <NewPositionPage />,
            },
        ].filter(Boolean) as RouteObject[],
    },
]);

export default function RouterProvider() {
    return <_RouterProvider router={router} />;
}
