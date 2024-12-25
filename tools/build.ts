import { execFileSync } from "child_process";
import { getExamples } from "./utils";

getExamples().forEach((example) => {
  console.log(`Build ${example.name}`);

  execFileSync("npm", ["run", "build"], {
    cwd: example.path,
  });
});
