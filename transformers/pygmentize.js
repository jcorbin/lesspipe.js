var pygLex = require('pygments-lexers');
var childProc = require('./lib/child_proc');

module.exports = childProc.transformer('pygmentize', function pygmentizer(cfg) {
    var argv = [cfg.cmd];
    if (cfg.formatter) argv.push('-f', cfg.formatter);
    Object.keys(cfg.options).forEach(function each(key) {
        argv.push('-P', key + '=' + cfg.options[key]);
    });

    return pygmentize;

    function pygmentize(info, stream, callback) {
        var pyg = (info.type && pygForType(info.type)) ||
                  (info.guessType && pygForType(info.guessType));
        if (pyg) {
            childProc.transform(argv.concat(['-l', pyg.name]), stream, callback);
        } else if (cfg.guess && info.charset !== 'binary') {
            childProc.transform(argv.concat(['-g']), stream, callback);
        } else {
            callback(null);
        }
    }
});

function pygForType(type) {
    for (var i = 0; i < pygLex.length; i++) {
        var pyg = pygLex[i];
        if (pyg.category === 'special') continue;
        if (pyg.mimetypes.indexOf(type) < 0) continue;
        return pyg;
    }
    return null;
}
