var childProc = require('./lib/child_proc');

module.exports = childProc.transformer('gzip', function gunziper(cfg) {
    var argv = [cfg.cmd, '-d', '-c'];
    return gunzip;

    function gunzip(info, stream, callback) {
        var self = this;
        if (info.type === 'application/x-gzip') {
            childProc.transform(argv, stream, gunziped);
        } else {
            callback(null);
        }
        function gunziped(err, stream) {
            if (err) return callback(err);
            self.process(info.path
                .replace(/\.g?z$/i, '')
                .replace(/\.tg?z$/i, '.tar'),
                stream, callback);
        }
    }
});
