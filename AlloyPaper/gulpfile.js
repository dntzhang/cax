var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');

var headerComment = '/* Alloy Game Engine\n'+
                     ' * By AlloyTeam http://www.alloyteam.com/\n'+
                     ' * Github: https://github.com/AlloyTeam/AlloyGameEngine\n'+
                     ' * MIT Licensed.\n' +
                     ' */\n';

gulp.task('concat', function () {
    gulp.src([

        'src/intro.js',
        'src/base/class.js',
        'src/base/alloy_paper.js',
        'src/base/matrix2d.js',
        'src/base/uid.js',

        'src/renderer/renderer.js',
        'src/renderer/canvas_renderer.js',
        'src/renderer/webgl_renderer.js',

        'src/display/display_object.js',
        'src/display/bitmap.js',
        'src/display/container.js',
        'src/display/graphics.js',
        'src/display/label.js',
        'src/display/shape.js',
        'src/display/sprite.js',
        'src/display/stage.js',
        'src/display/text.js',

        'src/outro.js'

    ])
        .pipe(concat('alloy_paper.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('alloy_paper.min.js'))
        .pipe(header(headerComment))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['concat']);