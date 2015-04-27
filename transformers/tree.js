var childProc = require('./lib/child_proc');

// TODO: could fallback to ls -l if no tree

module.exports = childProc.transformer('tree', function treeLister(cfg) {
    // TODO: provide more options
    var argv = [cfg.cmd,
        '-L', cfg.depth || 1,
        '-C', // colored
        '-h', // human sizes
        '-p', // show mode / perm info
        '-u', // show user
        '-g', // show group
        '-F'  // decorate with suffix sigil
    ];

    return listTree;

    function listTree(info, stream, callback) {
        if (info.stat && info.stat.isDirectory()) {
            childProc.transform(argv.concat([info.realpath]), stream, callback);
        } else {
            callback(null);
        }
    }
});
