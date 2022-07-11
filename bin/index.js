#!/usr/bin/env node

if (process.env.GITHUB_ACTION) {
  // eslint-disable-next-line no-console
  console.log('> Skip install on GitHub Action');
  process.exit(0);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require('../build');

build();
