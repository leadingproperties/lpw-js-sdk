var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var iife  = require('gulp-iife');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var rename = require("gulp-rename");

var paths = {
  scripts: ['src/scripts/*.js'],
  dist: ['dist/']
};

gulp.task('clean', function() {
  return del(['dist']);
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

gulp.task('uglify', function() {
  return gulp.src(paths.dist + 'sdk.js')
    .pipe(rename("sdk.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('build', gulpSequence('scripts', 'uglify'));

gulp.task('default', ['build']);