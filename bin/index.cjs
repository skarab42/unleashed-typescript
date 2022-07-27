#!/usr/bin/env node
/* eslint-disable no-console */
if (process.env.GITHUB_ACTION && process.env.GITHUB_REPOSITORY === 'skarab42/unleashed-typescript') {
  console.log('> Skip install on GitHub Action');
  return;
}

const { build } = require('../build');

build();
