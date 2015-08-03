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
        'src/base/are.js',

        'src/util/tween.js',
        'src/util/dom.js',
        'src/util/fps.js',
        'src/util/keyboard.js',
        'src/util/loader.js',
        'src/util/matrix2d.js',
        'src/util/observe.js',
        'src/util/raf.js',
        'src/util/to.js',
        'src/util/uid.js',
        'src/util/util.js',
        'src/util/vector2.js',

        'src/renderer/renderer.js',
        'src/renderer/canvas-renderer.js',
        'src/renderer/webgl-renderer.js',

        'src/display/display-object.js',
        'src/display/bitmap.js',
        'src/display/circle-shape.js',
        'src/display/container.js',
        'src/display/dom-element.js',
        'src/display/graphics.js',
        'src/display/label.js',
        'src/display/particle.js',
        'src/display/particle-system.js',
        'src/display/particle-explosion.js',
        'src/display/rect-adjust.js',
        'src/display/rect-shape.js',
        'src/display/shape.js',
        'src/display/sprite.js',
        'src/display/stage.js',
        'src/display/text.js',

        'src/outro.js'

    ])
        .pipe(concat('are.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('are.min.js'))
        .pipe(header(headerComment))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['concat']);