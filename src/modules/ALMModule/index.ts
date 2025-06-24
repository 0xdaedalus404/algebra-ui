import * as ALMHooks from "./hooks";
import * as ALMComponents from "./components";
import { enabledModules } from "config";
import { createSafeModule } from "../utils";

const ALMModule = createSafeModule(enabledModules.alm, ALMHooks, ALMComponents);

export default ALMModule;
