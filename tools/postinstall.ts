import { execFileSync } from "child_process";
import { getExamples } from "./utils";

getExamples().forEach((example) => {
  console.log(`Install packages for ${example.name}`);

  execFileSync("npm", [process.env.CI ? "ci" : "install"], {
    cwd: example.path,
  });
});
