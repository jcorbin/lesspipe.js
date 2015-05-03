var spawn = require('child_process').spawn;
var _which = require('which');

function which (prog) {
    try {
        return _which.sync(prog);
    } catch (err) {
        if (err.message === 'not found: ' + prog) {
            return null;
        } else {
            throw err;
        }
    }
}

module.exports.transformer = childProcTransformer;
module.exports.transform = childProcTransform;

function childProcTransformer(prog, transformer) {
    var cmd = which(prog);
    if (!cmd) return noopTransformer;
    return subTransformer;
    function subTransformer(options) {
        options.cmd = cmd;
        return transformer(options);
    }
}

function childProcTransform(argv, stream, callback) {
    var child = spawn(argv[0], argv.slice(1));
    if (stream) {
        stream.pipe(child.stdin);
    }

    child.on('exit', exited);
    child.on('error', passError);
    child.stdin.on('error', passError);

    function exited(code) {
        if (code !== 0) {
            console.error(
                'child exited abnormally (code %j): %s',
                code, argv.join(' ') // TODO: quote better
            );
        }
    }

    function passError(err) {
        if (err.errno !== 'EPIPE') {
            child.stdout.emit('error', err);
        }
    }

    callback(null, child.stdout);
}

function noopTransformer() {
    return noopTransform;
}

function noopTransform(info, stream, callback) {
    callback(null);
}
