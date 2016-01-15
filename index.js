var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');


module.exports = function(prepare, filename) {
    filename = filename || 'contents.js';

    var jsModules = {};

    function transform(file, enc, cb) {

        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // not supported stream
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-ws-contents',  'Streaming not supported'));
            cb();
            return;
        }

        var str = file.contents.toString(),
            obj = str.match(/^define\(\s*['"]js!([a-zA-Z0-9\.]+)['"]/m);

        if (obj) {
            var path = file.path,
                name = obj[1];

            if (typeof prepare === 'function') {
                path = prepare(path);
            }

            jsModules[name] = path;
        }

        cb();
    }


    function flush(cb) {
        if (Object.keys(jsModules).length === 0) {
            cb();
            return;
        }

        var contents =
            '(function(){\n' +
                'var jsModules = ' + JSON.stringify(jsModules) + ';\n' +
                'contents = window.contents = window.contents || {};\n' +
                'contents.jsModules = contents.jsModules || {};\n' +
                'for (var name in jsModules) {\n' +
                    'if (jsModules.hasOwnProperty(name)) {\n' +
                        'contents.jsModules[name] = jsModules[name];\n' +
                    '}\n' +
                '}\n' +
            '})();';

        var file = new gutil.File({
            path: path.join(process.cwd(), filename),
            contents: new Buffer(contents)
        });

        this.push(file);

        cb();
    }

    return through.obj(transform, flush);
};