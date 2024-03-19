import fs from "fs";
import path from "path";
import consola from "consola";
import { camelCase, upperFirst } from "lodash";
import { DEFAULT_CONFIG } from "./commands/init-config";

/**
 * Get config
 *
 * @returns
 */
export const getConfig = () => {
  const configPath = path.join(process.cwd(), "tw-config.json");

  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
};

/**
 * Check if config file already exists
 */
export const checkConfig = () => {
  const configPath = path.join(process.cwd(), "tw-config.json");
  if (fs.existsSync(configPath)) {
    consola.error("Config file already exists");
    process.exit(1);
  }
};

/**
 * Create folder if not exist
 *
 * @param modulePath
 */
export const createFolderIfNotExist = (modulePath: string) => {
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }
};

/**
 * Convert to PascalCase
 *
 * @param input
 * @returns
 */
export const toPascalCase = (input: string) => {
  return upperFirst(camelCase(input));
};

/**
 * Clean module
 *
 * @returns
 */
export const cleanModule = () => {
  const config = getConfig();

  if (!config.cleanModule) return;

  const modulePath = path.join(process.cwd(), config.modulePath);

  if (fs.existsSync(modulePath)) {
    fs.rmdirSync(modulePath, { recursive: true });
  }
};
