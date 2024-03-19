import consola from "consola";
import fs from "fs";
import path from "path";
import { cleanModule, createFolderIfNotExist, toPascalCase } from "../utils";
import {
  generateEntity,
  generateMapper,
  generateModel,
} from "./generate-interface";

interface Mapping {
  [key: string]: [string, string, string][];
}

/**
 * Extract mappings
 *
 * @param input
 * @returns
 */
function extractMappings(input: string): Mapping {
  const lines = input.split("\n").filter((line) => line.trim() !== "");

  const mapping: Mapping = {};

  let currentKey: string | undefined;
  for (const line of lines) {
    if (line.endsWith(":")) {
      currentKey = line.replace(":", "").trim();
      mapping[currentKey] = [];
    } else {
      if (currentKey) {
        const [source, target] = line.split("<=>").map((part) => part.trim());
        const [property, type] = source.split(":").map((part) => part.trim());
        mapping[currentKey].push([property, type, target || property]);
      }
    }
  }

  return mapping;
}

/**
 * Generate with schema
 */
export const generateWithSchema = () => {
  const schemaPath = path.join(process.cwd(), "schema", "schema.tws");

  if (!fs.existsSync(schemaPath)) {
    consola.error(
      "Schema file does not exist. Please create file schema/schema.tws"
    );
    process.exit(1);
  }

  cleanModule();

  const schema = fs.readFileSync(schemaPath, "utf-8");

  const mappings = Object.entries(extractMappings(schema));

  mappings.forEach(([key, value]) => {
    const pascalName = toPascalCase(key);
    consola.start(`Generating code for ${pascalName}`);

    // Generate Model
    generateModel(
      key,
      value.map(([property, type]) => [property, type])
    );

    // Generate Entity
    generateEntity(
      key,
      value.map(([_property, type, target]) => [target, type])
    );

    // Generate Mapper
    generateMapper(
      key,
      value.map(([property, _type, target]) => [
        property.includes(".") ? `'${property}'` : property,
        target,
      ])
    );

    consola.success(`Generated code for ${pascalName}`);
  });
};

/**
 * Initialize schema
 */
export const initSchema = () => {
  const schemaPath = path.join(process.cwd(), "schema");
  const schemaFile = path.join(process.cwd(), "schema", "schema.tws");

  if (fs.existsSync(schemaFile)) {
    consola.error("Schema file already exists");
    process.exit(1);
  }

  createFolderIfNotExist(schemaPath);

  const schema = `user:
  id: number <=> id
  name: string <=> name
  email: string <=> email
  companyName: string <=> company.name
  companyAddress: string <=> company.address.street`;

  fs.writeFileSync(schemaFile, schema);

  consola.success("Schema file created successfully");
};
