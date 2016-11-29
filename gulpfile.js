var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var iife  = require('gulp-iife');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var rename = require("gulp-rename");
var insert = require('gulp-insert');
var Server = require('karma').Server;
var gzip = require("gulp-gzip");
var s3 = require("gulp-s3-ls");
var gzipOptions = {gzipOptions: {level: 9}};
var s3Options = {
  headers: {
    'Cache-Control'   : 'max-age=315360000, no-transform, public'
  },
  uploadPath: "/"
};

var packageData = require('./package.json');

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
    .pipe(insert.prepend('/* @version ' + packageData.version +' | @license MIT */'))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task('uglify', function() {
  return gulp.src(paths.dist + 'sdk.js')
    .pipe(rename("sdk.min.js"))
    .pipe(uglify({
                   preserveComments: 'license'
                 }))
    .pipe(gulp.dest("dist"));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('deploy', function(){
    var aws = require('./aws.json'),
        versionSplit = packageData.version.split(/[.-]/);
    if(!versionSplit[3]){
      s3Options.uploadPath = '/' + packageData.version + '/';
      return gulp.src(paths.dist + '**')
        .pipe(
          gzip(gzipOptions)
        )
        .pipe(
          s3(aws, s3Options)
        );
    }else{
      console.log('Wait! It\'s: `' + versionSplit[3] + '`!');
    }
  }
);

gulp.task('test-dist', function (done) {
  new Server({
    configFile: __dirname + '/karma-dist.conf.js'
  }, done).start();
});

gulp.task('build', gulpSequence('scripts', 'uglify', 'test-dist'));

gulp.task('default', ['build']);