import FarmingModule from "./FarmingModule";
import ALMModule from "./ALMModule";
import LimitOrdersModule from "./LimitOrdersModule";

import { enabledModules } from "config";

export const activeModules = [
    enabledModules.farming && FarmingModule,
    enabledModules.alm && ALMModule,
    enabledModules.limitOrders && LimitOrdersModule,
].filter(Boolean);

export const isActiveModule = (m: typeof FarmingModule | typeof ALMModule | typeof LimitOrdersModule) => activeModules.includes(m);
