var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var order = require('gulp-order');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var spawn = require('child_process').spawn;

gulp.task('nodemon', function() {
  return nodemon({
    script: 'app.js'
  });
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: 'http://localhost:7000',
    files: ['routes/*.js', 'public/**/*.*', 'views/**/*.*'],
    port: 3000
  });
  gulp.watch('stylesheets/**/*.styl', ['styl']);
  gulp.watch('stylesheets/**/*.css', ['css']);
  gulp.watch('scripts/**/*.js', ['js']);
});

gulp.task('styl', function() {
  gulp.src('stylesheets/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('stylesheets/stylus'))
});

gulp.task('css', function() {
  // Library css
  gulp.src('stylesheets/lib/*.css')
    .pipe(order([
      'normalize.css'
    ]))
    .pipe(concat('deps.css'))
    .pipe(gulp.dest('public/stylesheets'));

  // Dev css
  gulp.src(['stylesheets/*.css', 'stylesheets/stylus/*.css'])
    .pipe(order([
      'style.css'
    ]))
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(cssmin())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('js', function() {
  // Library scripts
  gulp.src('scripts/lib/*.js')
    .pipe(order([
      'jquery.js'
    ]))
    .pipe(concat('deps.js'))
    .pipe(gulp.dest('public/scripts'));

  // Dev scripts
  gulp.src('scripts/*.js')
    .pipe(order([
      'test.js'
    ]))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/scripts'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('start', ['css', 'js', 'browser-sync'], function() {
  // start
});

gulp.task('default', function() {
  var process;
  function restart() {
    if (process) {
      process.kill();
    }
    process = spawn('gulp', ['start'], {stdio: 'inherit'});
  }

  gulp.watch('gulpfile.js', restart);
  restart();
});
