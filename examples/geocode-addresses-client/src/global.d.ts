declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  const svg: string;
  export default svg;
}

declare module "*.zip" {
  const url: string;
  export default url;
}
