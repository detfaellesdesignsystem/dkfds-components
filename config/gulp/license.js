const gulp = require("gulp");
const dutil = require("./doc-util");

const task = "license";

gulp.task(task, done => {
  dutil.logMessage(task, "Copying license");
  const stream = gulp.src("LICENSE.md").pipe(gulp.dest("dist"));

  done();
  return stream;
});
