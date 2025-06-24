import * as FarmingHooks from "./hooks";
import * as FarmingComponents from "./components";
import * as FarmingUtils from "./utils";
import { enabledModules } from "config";
import { createSafeModule } from "../utils";

const FarmingModule = createSafeModule(enabledModules.farming, FarmingHooks, FarmingComponents, FarmingUtils);

export default FarmingModule;
