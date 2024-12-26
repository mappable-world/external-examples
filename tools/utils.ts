import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";

const EXAMPLES_DIR_PATH = path.resolve(__dirname, "../examples");

export type Example = {
  name: string;
  path: string;
};

export function getExamples(): Example[] {
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

export function runScriptForAll(
  script: string,
  options: { custom?: boolean } = { custom: true }
) {
  getExamples().forEach((example) => {
    console.log(`Run script "${script}" for ${example.name}`);

    const args = options?.custom ? ["run", script] : [script];

    execFileSync("npm", args, {
      cwd: example.path,
    });
  });
}
