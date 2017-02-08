import browserSync from 'browser-sync'

export default (gulp, c) => {
  const server = async () =>
    await browserSync(c.bs)

  gulp.task('server', gulp.series(server, 'watch'))
}
