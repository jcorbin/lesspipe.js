var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var inherits = require('util').inherits;

var buildTransforms = require('./transformers');
var detect = require('./transformers/lib/detect');
var FileInfo = require('./transformers/lib/file_info');

module.exports = LessPipe;

function LessPipe(config, output) {
    var self = this;
    self.config = config;
    self.output = output;
    self.detect = detect;
    self.transform = buildTransforms(self.config.transform);
}

inherits(LessPipe, EventEmitter);

LessPipe.main = function main(argv, config, output) {
    var self = new LessPipe(config, output);
    self.on('error', onError);
    if (argv._.length) {
        self.process(argv._[0], null);
    } else {
        self.process(null, process.stdin);
    }
    function onError(err) {
        console.error(err);
    }
};

LessPipe.prototype.process = function process(path, stream, callback) {
    if (!callback) callback = output;

    var self = this;
    var info = new FileInfo(path);
    if (!stream && info.stat && info.stat.isFile()) {
        stream = fs.createReadStream(info.path);
    }
    if (stream) {
        self.detect(info, stream, handle);
    } else {
        handle(null, info, null);
    }

    function handle(err, info, instream) {
        self.transform(info, instream, transformed);
        function transformed(err, outstream) {
            callback(err, outstream || instream);
        }
    }

    function output(err, stream) {
        if (err) self.emit('error', err);
        if (stream) stream.pipe(self.output);
    }
};
