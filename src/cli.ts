#!/usr/bin/env node

import { program } from "commander";
import { initConfig } from "./commands/init-config";
import { generateEntity, generateModel } from "./commands/generate-interface";
import { generateWithSchema, initSchema } from "./commands/parse-schema";

program
  .command("init")
  .description("Initialize the config file")
  .action(() => {
    initConfig();
  });

program
  .command("schema")
  .description("Generate code")
  .argument("command", "Generate code from schema")
  .action((arg) => {
    switch (arg) {
      case "generate":
        generateWithSchema();
        break;
      case "init":
        initSchema();
        break;
      default:
        break;
    }
  });

program.parse();
