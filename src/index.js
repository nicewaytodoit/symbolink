#!/usr/bin/env node
'use strict';
const commandLineArgs = require('command-line-args');
const symlinkDir = require('symlink-dir');
const path = require('path');
const fs = require('fs');

const COLOR = {
    end: '\x1b[0m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
};

const log = console.log;
const loge = (msg) => log(COLOR.red, msg, COLOR.end);

const isEmpty = (value) => ['null', 'undefined', ''].includes(new String(value).toString().trim());

let options = undefined;
try {
    options = commandLineArgs([
        { name: 'file', alias: 'f', type: String, multiple: false },
        { name: 'root', alias: 'r', type: String, multiple: false },
        { name: 'link', alias: 'l', type: String, multiple: false },
        { name: 'dest', alias: 'd', type: String, multiple: false },
    ]);
} catch (error) {
    if (error?.name === 'UNKNOWN_OPTION') {
        log(`Unknown Option: [${error?.optionName}]`);
    }
}

const currentRoot = process.cwd();
// const [, , ...args] = process.argv;
// log(`Hello World [${args}]`);

// log(options);
// log(__dirname);
// log(process.cwd());

const getPath = (file, root = currentRoot) => (path.isAbsolute(file) ? file : path.join(root, file));

const createAllSymLinks = (links) => {
    // Any file or directory, that has the destination name, is renamed before creating the link
    Promise.all(
        links.map(
            (lnk) =>
                new Promise((resolve, reject) => {
                    symlinkDir(lnk.dest, lnk.link)
                        .then((result) => {
                            return resolve({ ...result, link: lnk.link });
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                }),
        ),
    )
        .then((results) => {
            for (var res of results) {
                if (res?.warn) log(COLOR.magenta, `Warning: [${res?.warn}]`, COLOR.end);
            }
            log(COLOR.green, 'Link creation done !', COLOR.end);
        })
        .catch((err) => {
            loge(err);
        });
};

const getLinks = (links, root) =>
    links
        .filter((lnk) => !isEmpty(lnk?.link) && !isEmpty(lnk?.dest))
        .map((lnk) => ({ link: getPath(lnk?.link, root), dest: getPath(lnk?.dest, root) }));

if (options?.file) {
    const filePath = getPath(options?.file);
    if (!fs.existsSync(filePath)) {
        loge('Config file does not exist', filePath);
    } else {
        const configFile = fs.readFileSync(filePath);

        let config = {};
        try {
            config = JSON.parse(configFile);
        } catch (error) {
            loge(`ERROR: JSON Parse issue: ${error?.message}`);
            return;
        }

        const root = isEmpty(config?.root) ? currentRoot : getPath(config?.root);

        if (!Array.isArray(config?.links)) {
            loge('ERROR: Sym links configuration missing');
        } else {
            const links = getLinks(config?.links, root);
            for (var a of links) {
                log(COLOR.yellow, `[@](${a.link})`, COLOR.blue, `===> ${a.dest}`, COLOR.end);
            }
            if (links.length > 0) createAllSymLinks(links);
        }
    }
} else {
    const root = isEmpty(options?.root) ? currentRoot : getPath(options?.root);
    const links = getLinks([{ link: options?.link, dest: options?.dest }], root);

    if (links.length > 0) {
        createAllSymLinks(links);
    } else {
        loge('Config file not present or link options not provided');
    }
}

// [i]dea : Going to version and doing everything with symlinks from one point package@2.3.1 symlink from nodemodules
// chmod +x cli.js
// npm unlink symbolink
