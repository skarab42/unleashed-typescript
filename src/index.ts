/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-console */
import {
  copySync,
  existsSync,
  outputFileSync,
  readFileSync,
  readJsonSync,
  removeSync,
  writeFileSync,
  writeJSONSync,
} from 'fs-extra';
import { resolve } from 'node:path';

import type { Patch } from './types';
import { rules } from './rules';

function error(message: string): never {
  throw new Error(message);
}

function warning(message: string): void {
  console.error(`WARNING: ${message}`);
}

function info(message: string): void {
  console.error(`INFO: ${message}`);
}

export function build(): void {
  const typescript: Patch = { version: '', path: '' };
  let unleashed: Patch = { version: '', path: '' };

  const unpatchFlag = process.argv.includes('--unpatch');
  const forcePatchFlag = process.argv.includes('--force-patch');

  // Try to find node_modules directory
  let nodeModulesPath = resolve(process.cwd(), '../node_modules');

  if (!existsSync(nodeModulesPath)) {
    nodeModulesPath = resolve(process.cwd(), 'node_modules');
  }

  if (!existsSync(nodeModulesPath)) {
    error('node_modules direcotry not found.');
  }

  const unleashedDirectory = resolve(nodeModulesPath, 'unleashed-typescript');
  const unleashedJSON = resolve(unleashedDirectory, 'unleashed-typescript.json');

  const unleashedDTS = resolve(unleashedDirectory, 'typescript.d.ts');
  const unleashedJS = resolve(unleashedDirectory, 'typescript.js');

  info(`unleashed-typescript found at ${unleashedDirectory}`);

  // Clean build
  if (unpatchFlag || forcePatchFlag) {
    info('Unpatch unleashed-typescript.');
    removeSync(unleashedDirectory);

    if (unpatchFlag) {
      outputFileSync(unleashedDTS, 'export {}');
      outputFileSync(unleashedJS, 'export default {}');
      outputFileSync(unleashedJSON, JSON.stringify(unleashed));

      info('Done!');
      return;
    }
  }

  // Try to find the local typescript package
  try {
    typescript.path = resolve(nodeModulesPath, 'typescript');
    typescript.version = (readJsonSync(resolve(typescript.path, 'package.json')) as { version: string }).version;
  } catch {
    error('typescript package does not seem to be installed.');
  }

  // Test if we already have a patched version.
  if (!forcePatchFlag && existsSync(unleashedDirectory)) {
    try {
      unleashed = readJsonSync(unleashedJSON) as Patch;
    } catch {
      error(
        'A patched version has been found but a problem occurred during loading of the configuration. Please create a fresh build with the --upgrade flag.',
      );
    }
  }

  if (!forcePatchFlag && unleashed.version) {
    const message = `Already build from typescript@${unleashed.version}.`;

    if (typescript.version === unleashed.version) {
      info(`${message} Everything is up to date!`);
    } else {
      warning(
        `${message} But your current version is typescript@${typescript.version}. Use --upgrade flag to sync with your version.`,
      );
    }

    return;
  }

  // Copy the original typescript lib directory contents and store the version and path
  info(`Found typescript@${typescript.version} at ${typescript.path}`);
  info(`Copy typescript@${typescript.version} to ${unleashedDirectory}`);

  copySync(typescript.path, unleashedDirectory, { overwrite: forcePatchFlag });
  writeJSONSync(unleashedJSON, typescript);

  // Apply all rules
  for (const rule of rules) {
    const filePath = resolve(unleashedDirectory, rule.file);
    let fileContent = readFileSync(filePath, 'utf8');

    for (const replace of rule.replace) {
      info(replace.description);
      try {
        // TODO: test if it match before replace to ensure that the patch is still applicable?
        fileContent = fileContent.replace(replace.pattern, replace.value);
      } catch (error) {
        warning('An error occurred during the application of this rule, please report the following issue.');
        warning((error as Error).message);
      }
    }

    writeFileSync(filePath, fileContent);
  }

  info('Done!');
}
