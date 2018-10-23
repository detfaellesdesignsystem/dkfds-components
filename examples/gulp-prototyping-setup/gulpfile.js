'use strict';

/* ::: Base Gulp File ::: */
/*
 # INDEX
 : Imports

 : Settings
 :: Paths
 :: Plumber Config
 :: Vendor Settings
 :: Browsersync
 ::: Serve Task

 : Project Tasks
 :: Source JavaScript
 :: Source CSS
 :: Source Views - Panini Based

 : Vendor Tasks
 :: Vendor Javascript
 :: Vendor CSS

 : Move Tasks
 :: Move Fonts
 :: Move Icons
 :: Move Images
 :: Move JS
 :: Move CSS

 : Runnable Tasks
 :: Watch Task
 :: Build Task
 :: Prototype Task

 : Default/Help Task

 */

 
/* ::: Gulp Imports ::: */
var gulp            = require('gulp');
var color           = require('gulp-color');
var concat          = require('gulp-concat');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var sourcemaps      = require('gulp-sourcemaps');
var browserify      = require('browserify');
var buffer          = require('vinyl-buffer');
var source          = require('vinyl-source-stream');
var uglify          = require('gulp-uglify');
var notify          = require('gulp-notify');
var sequence        = require('run-sequence');
var plumber         = require('gulp-plumber');
var nunjucksRender  = require('gulp-nunjucks-render');
var rename          = require('gulp-rename');

/* ::: Settings ::: */
/* ::: Paths ::: */
var paths = {
  // Source Dirs
  src: {
      root: 'src',
      assets: 'src/assets',
      components: 'src/components',
      data: 'src/data',
      fonts: 'src/assets/fonts',
      img: 'src/assets/img',
      js: 'src/js',
      scss: 'src/css',
      vendor: 'src/vendor',
      view: 'src/views'

  },

  // Prototype Dirs
  prototype: {
      root: 'dist',
      css: 'dist/assets/css',
      fonts: 'dist/assets/fonts',
      img: 'dist/assets/img',
      js: 'dist/assets/js'

  }
};

/* ::: Plumber Config ::: */
// # Settings for error handling and notification
var plumberConfig = {
  errorHandler: function (err) {
      // # Remove Dir from filename
      var filename = err.file.replace(/^.*[\\\/]/, '');
      // # Notify Error
      notify.onError({message: 'Error in ' + filename + '\r\rMore in terminal.', title: "Gulp Error"})(err);
      // # Post error in console
      console.log(err.message);
      this.emit('end');
  }
};

/* ::: Vendor Settings ::: */
var vendor = {
  // # Add Vendor CSS Here
  css: [
      paths.src.vendor + '/css/bootstrap-sass-grid.scss'
  ],
  // # Add Vendor JS here
  js: [

  ]
};

/* ::: BrowserSync ::: */
var browserSync = require('browser-sync').create();

/* ::: BrowserSync Serve ::: */
gulp.task('serve', function() {
    console.log(color('::::::::::::::::::: Serve via Browsersync :::::::::::::::::::', 'CYAN'));
    browserSync.init({
        startPath: paths.prototype.root,
        server:{
            baseDir: './'
        }
    });
});
/* ::: BrowserSync Reload ::: */
gulp.task('serve:reload', function() {
    console.log(color('::::::::::::::::::: Update Browsersync :::::::::::::::::::', 'CYAN'));
    browserSync.reload;
});

/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
/* ::: Project Tasks ::: */

gulp.task('src:css', function () {
  console.log(color('::::::::::::::::::: Compressing Source CSS :::::::::::::::::::', 'CYAN'));
  return gulp.src([
    paths.src.scss+'/**/*.scss',
      '!**/_*.scss'
    ])
    .pipe(plumber(plumberConfig))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'node_modules/dkfds/dist/css',
      ],
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer({
      // NB: browsers are read from the "browserslist" field in
      // package.json
      cascade: false,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( paths.prototype.css ));
});

gulp.task('src:js', function () {
  return browserify({
      entries: paths.src.js+'/main.js',
      debug: true,
    })
    .transform('babelify', {
      global: true,
      presets: ['es2015']
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.prototype.js));
});

/* ::: Create views using Panini ::: */
gulp.task('src:view', function() {
  console.log(color('::::::::::::::::::: Compiling Source Views :::::::::::::::::::', 'CYAN'));
  gulp.src(paths.src.view + '/**/*.{html,njk}')
      .pipe(nunjucksRender())
      .pipe(rename({ extname: '.html' }))
      .pipe(gulp.dest(paths.prototype.root))
});

/* ::: Create views using Panini ::: */
gulp.task('src:view:sync', ['src:view'],function(done) {
  browserSync.reload();
  done();
});


/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
/* ::: Move Tasks ::: */
/* ::: Move Fonts ::: */
gulp.task('move:fonts', function() {
  console.log(color('::::::::::::::::::: Move Fonts :::::::::::::::::::', 'CYAN'));
  return gulp.src([
      paths.src.fonts + '/*.{eot,svg,ttf,woff,woff2}',
      'node_modules/dkfds/src/fonts/**/*.{eot,svg,ttf,woff,woff2}'
    ])
    .pipe(gulp.dest(paths.prototype.fonts))
});

/* ::: Move Images ::: */
gulp.task('move:images', function() {
  console.log(color('::::::::::::::::::: Moving Images to Prototype :::::::::::::::::::', 'CYAN'));
  return gulp.src([
      paths.src.img + '/*.{jpg,jpeg,png,gif,svg}',
      'node_modules/dkfds/src/img/**/*.{png,svg}'
    ])
      .pipe(gulp.dest(paths.prototype.img))
});


/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
/* ::: Runnable Tasks ::: */

/* ::: Watch task ::: */
gulp.task('watch', ['serve'], function() {
  console.log(color('::::::::::::::::::: Watch Task :::::::::::::::::::', 'CYAN'));
  // Watch and compile CSS
  gulp.watch([paths.src.scss + '/*.scss', paths.src.scss + '/**/*.scss', paths.src.components + '/**/*.scss'], ['src:css', browserSync.reload]);
  // Watch and compile JS
  gulp.watch([paths.src.js + '/*.js', paths.src.components + '/**/*.js'], ['src:js', browserSync.reload]);
  // Watch and compile views
  gulp.watch([paths.src.view + '/**/*.{html,njk}'], ['src:view:sync']);
});

/* ::: Build Task ::: */
gulp.task('build', ['src:js', 'src:css', 'src:view', 'move:images', 'move:fonts'], function() {
  console.log(color('::::::::::::::::::: Building Project :::::::::::::::::::', 'CYAN'));
});

/* ::: Prototype Task ::: */
gulp.task('prototype', function() {
  console.log(color('::: Serving Prototype :::', 'CYAN'))
  sequence('build', 'watch');
});

/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
/* ::: Default Task ::: */
gulp.task('default', function() {
  console.log(color("::::::::::::::::::: Available Gulp Tasks :::::::::::::::::::", 'CYAN'));
  console.log("gulp                   - This screen.");
  console.log(" ");
  console.log("gulp build             - Builds the entire project, vendor included.");
  console.log("gulp watch             - Watch project files, vendor excluded.");
  console.log("");
  console.log("gulp prototype         - Build and serve prototype");
  console.log(color("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::", 'MAGENTA'));
});

/* ::: Help Task ::: */
// # If anyone is feeling old school.
gulp.task('help', ['default']);
