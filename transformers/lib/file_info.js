var fs = require('fs');

function FileInfo(name) {
    this.path = name || '';
    this.stat = maybeStat(this.path);
}

function maybeStat(path) {
    try {
        return fs.statSync(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}

module.exports = FileInfo;
