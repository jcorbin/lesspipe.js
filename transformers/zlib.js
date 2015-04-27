var zlib = require('zlib');

module.exports = zlibTransformer;

function zlibTransformer() {
    return zlibTransform;
}

function zlibTransform(info, stream, callback) {
    var self = this;
    if (info.type === 'application/zlib') {
        unziped(stream.pipe(zlib.createUnzip()));
    } else if (info.type === 'application/x-gzip') {
        unziped(stream.pipe(zlib.createGunzip()));
    } else {
        callback(null);
    }
    function unziped(stream) {
        self.process(info.path
            .replace(/\.g?z$/i, '')
            .replace(/\.tg?z$/i, '.tar'),
            stream, callback);
    }
}
