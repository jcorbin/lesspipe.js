var childProc = require('./lib/child_proc');

module.exports = childProc.transformer('tar', function tarLister(cfg) {
    var argv = [cfg.cmd, '-t'];
    return tarList;

    function tarList(info, stream, callback) {
        if (info.type === 'application/x-tar') {
            // TODO: tree transform would be nice
            childProc.transform(argv, stream, callback);
        } else {
            callback(null);
        }
    }
});
