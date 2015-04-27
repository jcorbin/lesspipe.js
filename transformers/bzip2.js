var childProc = require('./lib/child_proc');

module.exports = childProc.transformer('bzip2', function bunziper(cfg) {
    var argv = [cfg.cmd, '-d', '-c'];
    return bunzip;

    function bunzip(info, stream, callback) {
        var self = this;
        if (info.type === 'application/x-bzip2') {
            childProc.transform(argv, stream, bunziped);
        } else {
            callback(null);
        }
        function bunziped(err, stream) {
            if (err) return callback(err);
            self.process(info.path
                .replace(/\.bz2?$/i, '')
                .replace(/\.tbz2?$/i, '.tar'),
                stream, callback);
        }
    }
});
