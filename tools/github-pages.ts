import path from "path";
import fs from "fs";
import { getExamples } from "./utils";

const STATIC_FOLDER = path.resolve(__dirname, "../github-pages-static");

if (fs.existsSync(STATIC_FOLDER)) {
  fs.rmSync(STATIC_FOLDER, { recursive: true });
}

getExamples().forEach((example) => {
  const exampleDistFolder = path.join(example.path, "dist");
  if (!fs.existsSync(exampleDistFolder)) {
    throw `${example.name} "dist" folder does not exist`;
  }

  fs.cpSync(exampleDistFolder, path.join(STATIC_FOLDER, example.name), {
    recursive: true,
  });
});
