import * as fs from "fs";
import * as path from "path";
import { checkConfig } from "../utils";
import consola from "consola";

export const DEFAULT_CONFIG = {
  modulePath: "/app",
  modelSuffix: ".model",
  mapperSuffix: ".mapper",
  entitySuffix: ".entity",
  overwrite: false,
} as const;

export const initConfig = () => {
  const configPath = path.join(process.cwd(), "tw-config.json");
  checkConfig();

  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));

  consola.success("Config file created successfully");
};
