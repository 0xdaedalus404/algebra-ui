import * as LimitOrdersHooks from "./hooks";
import * as LimitOrdersComponents from "./components";
import { enabledModules } from "config";
import { createSafeModule } from "../utils";

const LimitOrdersModule = createSafeModule(enabledModules.limitOrders, LimitOrdersHooks, LimitOrdersComponents);

export default LimitOrdersModule;
