import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";

const EXAMPLES_DIR_PATH = path.resolve(__dirname, "../examples");

export function getExamples() {
  return fs
    .readdirSync(EXAMPLES_DIR_PATH, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .filter((file) =>
      fs.existsSync(path.join(EXAMPLES_DIR_PATH, file.name, "package.json"))
    )
    .map((file) => ({
      name: file.name,
      path: path.join(EXAMPLES_DIR_PATH, file.name),
    }));
}

export function runScriptForAll(script: string) {
  getExamples().forEach((example) => {
    console.log(`Run script "${script}" for ${example.name}`);

    execFileSync("npm", ["run", script], {
      cwd: example.path,
    });
  });
}
