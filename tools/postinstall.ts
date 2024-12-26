import { runScriptForAll } from "./utils";

runScriptForAll(process.env.CI ? "ci" : "install");
