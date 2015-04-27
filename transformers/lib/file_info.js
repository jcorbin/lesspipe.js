var fs = require('fs');
var mime = require('mime');

function FileInfo(name) {
    this.path = name || '';
    this.stat = maybeStat(this.path);
    this.guessType = null;
    this.guessCharset = null;
    if (this.path) {
        this.guessType = mime.lookup(this.path);
        this.guessCharset = mime.charsets.lookup(this.type);
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
