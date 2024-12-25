import { execFileSync } from "child_process";
import { getExamples } from "./utils";

getExamples().forEach((example) => {
  console.log(`Test ${example.name}`);

  execFileSync("npm", ["run", "test"], {
    cwd: example.path,
  });
});
