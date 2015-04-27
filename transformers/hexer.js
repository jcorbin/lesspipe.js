var hex = require('hexer');

module.exports = hexerTransformer;

function hexerTransformer() {
    return hexerTransform;
}

function hexerTransform(info, stream, callback) {
    if (info.type) {
        console.log('# mime-type:', info.type);
    }
    if (info.charset === 'binary') {
        var hexed = hex.Transform({
            colored: true
        });
        stream.pipe(hexed);
        callback(null, hexed);
    } else {
        callback(null);
    }
}
