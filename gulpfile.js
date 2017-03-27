var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');
var path = require('path');
var del = require('del');

gulp.task('clean', function (cb) {
    console.log('cleaning');
    return del('dist', cb)
})

gulp.task('build', ['clean'], function () {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return tsResult.js
        .pipe(sourcemaps.write('.', {
            sourceRoot: function (file) { return file.cwd + '/src'; }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], () => { });
