#!/usr/bin/env node
'use strict';
const commandLineArgs = require('command-line-args');
const symlinkDir = require('symlink-dir');
const path = require('path');

let options = undefined;
try {
    options = commandLineArgs([
        {
            name: 'file',
            alias: 'f',
            type: String,
            multiple: false,
        },
    ]);
} catch (error) {
    if (error?.name === 'UNKNOWN_OPTION') {
        console.log(`Unknown Option: [${error?.optionName}]`);
    }
}

// grab provided args.
const [, , ...args] = process.argv;

// Printe helo world provided args.
console.log(`Hello World [${args}]`);

console.log(options);

// Any file or directory, that has the destination name, is renamed before creating the link
// symlinkDir('b', 'c/b/')
//   .then(result => {
//     console.log('Message:', result);
//     //> { reused: false }

//     // return symlinkDir('b', 'c/a');
//     // return "This is not ok";
//   })
//   .catch(err => console.error(err))

// chmod +x cli.js
// npm unlink symbolink
