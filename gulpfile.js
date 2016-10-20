var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var browserSync  = require('browser-sync').create();
var iife  = require('gulp-iife');

var paths = {
  scripts: ['src/scripts/*.js']
};

gulp.task('clean', function() {
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat("sdk.js"))
    .pipe(iife({
                 params: ["window"],
                 args: ["window"]
               }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

// gulp.task('watch', function() {
//   browserSync.init({
//                      proxy: config.devUrl,
//                      port: 8080
//                    });
//   gulp.watch([path.source + 'app/assets/styles/**/*'], ['styles']);
//   gulp.watch([path.source + 'app/modules/**/*'], ['jshint', 'scripts']);
//   gulp.watch([path.source + 'app/templates/**/*'], ['templates']);
// });
gulp.task('default', ['watch', 'scripts']);