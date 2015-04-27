module.exports = buildTransforms;

function buildTransforms(options) {
    var transforms = [
    ].map(function each(delegateName) {
        var delegateTransformer = require('./' + delegateName);
        return delegateTransformer(options[delegateName] || {});
    });
    return delegateTransform;

    function delegateTransform(info, stream, callback) {
        var self = this;
        next(0);
        function next(i) {
            if (i >= transforms.length) {
                callback(null);
            } else {
                transforms[i].call(self, info, stream, done);
            }
            function done(err, stream) {
                if (err || stream) {
                    callback(err, stream);
                } else {
                    next(i + 1);
                }
            }
        }
    }
}
