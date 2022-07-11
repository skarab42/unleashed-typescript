/* eslint-disable no-console */

import {
  copySync,
  existsSync,
  readFileSync,
  readJsonSync,
  removeSync,
  writeFileSync,
  writeJSONSync,
} from "fs-extra";
import { dirname, resolve } from "path";

import type { Patch } from "./types";
import { rules } from "./rules";

function error(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function warning(message: string): void {
  console.error(`WARNING: ${message}`);
}

function info(message: string): void {
  console.error(`INFO: ${message}`);
}

export function build() {
  let typescript: Patch = { version: "", path: "" };
  let unleashed: Patch = { version: "", path: "" };

  const upgradeFlag = process.argv.includes("--upgrade");

  const unleashedDir = resolve(__dirname, "../unleashed-typescript");
  const unleashedJSON = resolve(unleashedDir, "unleashed-typescript.json");

  // Clean build
  if (upgradeFlag) {
    removeSync(unleashedDir);
  }

  // Try to find the local typescript package
  try {
    typescript.path = dirname(require.resolve("typescript"));
    typescript.version = require("typescript").version;
  } catch (_err) {
    error("typescript package does not seem to be installed.");
  }

  // Test if we already have a patched version.
  if (!upgradeFlag && existsSync(unleashedDir)) {
    try {
      unleashed = readJsonSync(unleashedJSON);
    } catch (_err) {
      error(
        "A patched version has been found but a problem occurred during loading of the configuration. Please create a fresh build with the --upgrade flag."
      );
    }
  }

  if (!upgradeFlag && unleashed.version) {
    const message = `Already build from typescript@${unleashed.version}.`;

    if (typescript.version === unleashed.version) {
      info(`${message} Everything is up to date!`);
    } else {
      warning(
        `${message} But your current version is typescript@${typescript.version}. Use --upgrade flag to sync with your version.`
      );
    }

    process.exit(0);
  }

  // Copy the original typescript lib directory contents and store the version and path
  info(`Found typescript@${typescript.version} at ${typescript.path}`);
  info(`Copy typescript@${typescript.version} to ${unleashedDir}`);

  copySync(typescript.path, unleashedDir, { overwrite: upgradeFlag });
  writeJSONSync(unleashedJSON, typescript);

  // Apply all rules
  rules.forEach((rule) => {
    const filePath = resolve(unleashedDir, rule.file);
    let fileContent = readFileSync(filePath, "utf8");

    rule.replace.forEach((replace) => {
      info(replace.description);
      try {
        // TODO: test if it match before replace to ensure that the patch is still applicable?
        fileContent = fileContent.replace(replace.pattern, replace.value);
      } catch (error) {
        warning(
          "An error occurred during the application of this rule, please report the following issue."
        );
        warning((error as Error).message);
      }
    });

    writeFileSync(filePath, fileContent);
  });

  info("Done!");
}
