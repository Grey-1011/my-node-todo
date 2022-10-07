#!/usr/bin/env node

import * as api from './index.js'

// ECMAScript (.mjs)
import { Command } from 'commander';
const program = new Command();

//ES Modules 模式下， 引入、读取 package.json
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

program
  .version(pkg.version)

program
  .command('add <taskName...>')
  .description('add a task')
  .action((...args) => {
    const words = args[0].join(' ');
    // console.log(words)
    api.add(words).then(() => { console.log('success!') }).catch(() => { console.log('failure!') })
  })

program
  .command('clear')
  .description('clear all task')
  .action(() => {
    api.clear().then(() => { console.log('cleared!') }).catch(() => { console.log('failure!') })
  })

program
  .command('list')
  .description('show all task')
  .action(() => {
    api.showAll()
  })

program
  .addHelpCommand(false) // 关掉默认的 help command
//   .showHelpAfterError(false)
//   .showSuggestionAfterError(false);


program.parse(process.argv);



// console.log('argv=>',process.argv)

// const options = program.opts();
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));
