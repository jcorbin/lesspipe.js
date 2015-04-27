var fs = require('fs');
var mime = require('mime');

function FileInfo(name) {
    this.path = name || '';
    this.realpath = maybeRealpath(this.path);
    this.stat = maybeStat(this.path);
    this.type = null;
    this.charset = null;
    this.guessType = null;
    this.guessCharset = null;
    if (this.path) {
        this.guessType = mime.lookup(this.path);
        this.guessCharset = mime.charsets.lookup(this.type);
    }
}

function maybeRealpath(path) {
    try {
        return fs.realpathSync(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}

function maybeStat(path) {
    try {
        return fs.statSync(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}

module.exports = FileInfo;
