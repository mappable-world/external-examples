import path from "path";
import fs from "fs";
import { Example, getExamples } from "./utils";

const STATIC_FOLDER = path.resolve(__dirname, "../github-pages-static");
const TEMPLATES_FOLDER = path.resolve(__dirname, "templates");
const INDEX_PAGE_TEMPLATE_PATH = path.resolve(TEMPLATES_FOLDER, "index.html");

const EXAMPLES_LINKS_LIST_REGEXP = /%EXAMPLES_LINKS_LIST%/;

if (fs.existsSync(STATIC_FOLDER)) {
  fs.rmSync(STATIC_FOLDER, { recursive: true });
}

const examples = getExamples();

examples.forEach((example) => {
  const exampleDistFolder = path.join(example.path, "dist");
  if (!fs.existsSync(exampleDistFolder)) {
    throw `${example.name} "dist" folder does not exist`;
  }

  fs.cpSync(exampleDistFolder, path.join(STATIC_FOLDER, example.name), {
    recursive: true,
  });
});

const indexPageContent = fs
  .readFileSync(INDEX_PAGE_TEMPLATE_PATH, "utf8")
  .replace(EXAMPLES_LINKS_LIST_REGEXP, getLinkList(examples).join(""));
fs.writeFileSync(path.join(STATIC_FOLDER, "index.html"), indexPageContent);

export function getLinkList(examples: Example[]): string[] {
  return examples.map(({ name }) => `<a href="${name}/index.html">${name}</a>`);
}
