# gulp-ws-contents

Plugin to create the file contents.js for testing modules [WS framework](http://wi.sbis.ru/).

## API

### wsContents(prepare, filename)

#### prepare

Type: `Function`  
Default: `null`  
Example: prepare(path)  

#### filename

Type: `String`  
Default: `'contents.js'`  

Contents filename.


## Usage

```javascript
var gulp = require('gulp');
var wsContents = require('gulp-ws-contents');


gulp.task('default', function() {
    return gulp.src('./proj/controls/**/*.module.js')
        .pipe(wsContents(function(path) {
            // Here you can change the path.
            return path;
        }))
        .pipe(gulp.dest('./dist'));
});
```