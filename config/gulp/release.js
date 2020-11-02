var gulp = require('gulp');
var dutil = require('./doc-util');
var appRoot = require('app-root-path');
var zipFolder = require('zip-folder');
var runSequence = require('gulp4-run-sequence');
var del = require('del');
var task = 'release';

gulp.task('make-tmp-directory', done => {

  dutil.logMessage('make-tmp-directory', 'Creating temporary release directory.');

  return gulp.src('dist/**/*')
    .pipe(gulp.dest(dutil.dirName));

});

gulp.task('clean-tmp-directory', done => {

  dutil.logMessage('clean-tmp-directory', 'Deleting temporary release directory.');

  return del(dutil.dirName);
});

/*
Gulp.task for zipping the compiled files to the dist folder, to make it easier to distribute the compiled code
The function uses two simple node packages:
- zip-folder     (https://github.com/sole/node-zip-folder)
- app-root-path  (https://github.com/inxilpro/node-app-root-path)
The zip-folder package allows for zipping a specific folder to a specific path.
The app-root-path package automatically finds the root path of the project, which is necassery with the zip-folder package.
*/
gulp.task('zip-archives', done => {

  dutil.logMessage('zip-archives', 'Creating a zip archive in dist/' + dutil.dirName + '.zip');

  zipFolder(appRoot + '/' + dutil.dirName, appRoot + '/dist/'+ dutil.dirName + '.zip', function(err) {
    if(err) {
      dutil.logMessage("Something went wrong while zipping", err);
    } else {
      dutil.logMessage('zip-archives', dutil.dirName + "succesfully zipped to dist/" + dutil.dirName + ".zip");
    }

    done();
  });
});

gulp.task(task, done => {

  dutil.logMessage(task, 'Creating a zip archive at dist/' + dutil.dirName + '.zip');

  runSequence(
    'make-tmp-directory',
    'zip-archives',
    'clean-tmp-directory',
    done
  );
});
