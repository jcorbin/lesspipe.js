#!/usr/bin/env node

var minimist = require('minimist');
var LessPipe = require('./lesspipe');

// TODO: configurable

LessPipe.main(minimist(process.argv.slice(2)), {
    transform: {
        tree: {
            depth: 2
        },
        pygmentize: {
            guess: true,
            formatter: 'terminal256',
            options: {
                style: 'monokai',
                encoding: 'utf-8'
            }
        }
    }
}, process.stdout);
