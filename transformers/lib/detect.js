var PassThrough = require('readable-stream').PassThrough;
var mmm = require('mmmagic');

module.exports = detect;

function detect(info, stream, callback) {
    var bufstream = PassThrough();
    stream.pause();
    stream.pipe(bufstream);

    var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE |
                              mmm.MAGIC_MIME_ENCODING);
    stream.on('error', onError);
    stream.on('data', onChunk);
    stream.resume();

    function onError(err) {
        stream.removeListener('error', onError);
        stream.removeListener('data', onChunk);
        finish(err, null);
    }

    function onChunk(chunk) {
        stream.removeListener('error', onError);
        stream.removeListener('data', onChunk);
        magic.detect(chunk, magicResult);
    }

    function magicResult(err, result) {
        if (err) return finish(err, null);
        var parts = result.split(/; */);
        info.type = parts[0];
        for (var i = 1; i < parts.length; i++) {
            var match = /^([^=]+)=(?:(\d+)|(.+))/.exec(parts[i]);
            if (match) {
                info[match[1]] = typeof match[2] === 'number' ? match[2] : match[3];
            }
        }
        return finish(null, info);
    }

    function finish(err, info) {
        callback(err, info, bufstream);
    }
}
