import { execFileSync } from "child_process";
import { getExamples } from "./utils";

getExamples().forEach((example) => {
  console.log(`Lint ${example.name} project`);

  execFileSync("npm", ["run", "lint"], {
    cwd: example.path,
  });
});
