var childProc = require('./lib/child_proc');

module.exports = childProc.transformer('git', function gitTransformer(cfg) {
    var delegates = [
        showPack,
        showObject
    ];

    function gitTransform(info, stream, callback) {
        var self = this;
        for (var i = 0; i < delegates.length; i++) {
            var delegate = delegates[i];
            var match = delegate.pattern.exec(info.realpath);
            if (match) {
                delegate.call(self, match, info, stream, callback);
                return;
            }
        }
        callback(null);
    }

    showPack.pattern = /^(.+)\/objects\/pack\/(pack-[0-9a-f]{40}\.idx)$/;
    function showPack(match, info, stream, callback) {
        var self = this;
        var gitDir = match[1];
        var pack = match[2];
        var cmd = [cfg.cmd, '--git-dir=' + gitDir, 'show-index'];
        console.log('%s $ git show-index <%s', gitDir, pack);
        childProc.transform(cmd, stream, shown);
        function shown(err, stream) {
            if (err) return callback(err);
            var uri = 'file+git://' + gitDir + '#' + pack;
            self.process(uri, stream, callback);
        }
    }

    showObject.pattern = /^(.+)\/objects\/([0-9a-f]{2})\/([0-9a-f]{38})$/;
    function showObject(match, info, stream, callback) {
        var self = this;
        var gitDir = match[1];
        var sha = match[2] + match[3];
        var cmd = [cfg.cmd,
            '--git-dir=' + gitDir,
            'show',
            '--format=' + (cfg.showFormat || 'raw'),
            sha];
        console.log('%s $ git show %s', gitDir, sha);
        childProc.transform(cmd, null, shown);
        function shown(err, stream) {
            if (err) return callback(err);
            var uri = 'file+git://' + gitDir + '#' + sha;
            self.process(uri, stream, callback);
        }
    }

    return gitTransform;
});
