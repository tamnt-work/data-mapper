import consola from "consola";
import * as fs from "fs";
import { kebabCase } from "lodash";
import path from "path";
import { createFolderIfNotExist, getConfig, toPascalCase } from "../utils";

/**
 * Initialize folder
 *
 * @param kebabName
 * @param suffix
 * @returns
 */
const initFolder = ({
  kebabName,
  override,
  suffix,
}: {
  kebabName: string;
  suffix?: string;
  override?: boolean;
}) => {
  const config = getConfig();
  const modulePath = path.join(process.cwd(), config.modulePath);
  const folderPath = path.join(modulePath, kebabName);
  createFolderIfNotExist(modulePath);
  createFolderIfNotExist(folderPath);
  const filePath = path.join(folderPath, `${kebabName}${suffix}.ts`);

  if (!override && fs.existsSync(filePath)) {
    throw new Error(`${filePath} already exists`);
  }

  return {
    folderPath,
    filePath,
  };
};

/**
 * Create mapper
 *
 * @param name
 * @param input
 */
const createMapper = (name: string, input: [string, string][]) => {
  const config = getConfig();
  const pascalName = toPascalCase(name);
  const kebabName = kebabCase(pascalName);

  let code = `import { Mapper, type TransformationMap } from '@tamnt-work/data-mapper'\n`;
  code += `import type { ${pascalName}Entity } from './${kebabName}${config.entitySuffix}'\n`;
  code += `import type { ${pascalName}Model } from './${kebabName}${config.modelSuffix}'\n\n`;

  code += `const transformationMap: TransformationMap<${pascalName}Model, ${pascalName}Entity> = {\n`;

  for (const [propertyName, targetPropertyName] of input) {
    code += `  ${propertyName}: '${targetPropertyName}',\n`;
  }

  code += `}\n\n`;

  code += `export const ${pascalName}Mapper = new Mapper<${pascalName}Entity, ${pascalName}Model>(transformationMap)\n`;

  try {
    const { filePath } = initFolder({
      kebabName,
      suffix: config.mapperSuffix,
      override: config.overwrite,
    });
    fs.writeFileSync(filePath, code);
  } catch (error) {
    consola.error(error.message);
  }
};

/**
 * Parse nested properties
 *
 * @param properties
 * @returns
 */
function parseNestedProperties(properties: [string, string][]): string {
  let output = "";
  const nestedProperties: { [key: string]: [string, string][] } = {};

  for (const [property, type] of properties) {
    const parts = property.split(".");
    if (parts.length === 1) {
      output += `${property}: ${type}\n`;
    } else {
      const key = parts.shift()!;
      if (!nestedProperties[key]) {
        nestedProperties[key] = [];
      }
      nestedProperties[key].push([parts.join("."), type]);
    }
  }

  for (const [key, value] of Object.entries(nestedProperties)) {
    output += `${key}: {\n${parseNestedProperties(value)
      .trim()
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n")}\n}\n`;
  }

  return output;
}

/**
 * Create interface
 *
 * @param interfaceName
 * @param properties
 * @param suffix
 */
const createInterface = (
  name: string,
  properties: [string, string][],
  suffix: string
) => {
  const config = getConfig();
  const pascalName = toPascalCase(name);
  const interfaceName = pascalName + toPascalCase(suffix);
  let interfaceContent = `export interface ${interfaceName} {\n`;
  interfaceContent += parseNestedProperties(properties)
    .trim()
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

  interfaceContent += "\n}\n";
  const kebabName = kebabCase(pascalName);
  try {
    const { filePath } = initFolder({
      kebabName,
      suffix,
      override: config.overwrite,
    });

    fs.writeFileSync(filePath, interfaceContent);
  } catch (error) {
    consola.error(error.message);
  }
};

/**
 * Generate model
 *
 * @param interfaceName
 * @param properties
 */
export const generateModel = (
  interfaceName: string,
  properties: [string, string][] = []
) => {
  const config = getConfig();
  const pascalName = toPascalCase(interfaceName);
  createInterface(pascalName, properties, config.modelSuffix);
  consola.success(`Model ${pascalName} created successfully`);
};

/**
 * Generate entity
 *
 * @param interfaceName
 * @param properties
 */
export const generateEntity = (
  interfaceName: string,
  properties: [string, string][] = []
) => {
  const config = getConfig();
  const pascalName = toPascalCase(interfaceName);
  createInterface(pascalName, properties, config.entitySuffix);

  consola.success(`Entity ${pascalName} created successfully`);
};

/**
 * Generate mapper
 *
 * @param interfaceName
 * @param properties
 */
export const generateMapper = (
  name: string,
  properties: [string, string][] = []
) => {
  const pascalName = toPascalCase(name);
  createMapper(pascalName, properties);
  consola.success(`Mapper ${pascalName} created successfully`);
};
