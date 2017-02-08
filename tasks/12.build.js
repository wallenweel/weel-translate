export default (gulp, c) =>
  gulp.task('build', gulp.series('clean', c.tasks))
