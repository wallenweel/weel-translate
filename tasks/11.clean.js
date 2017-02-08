import del from 'del'

export default (gulp, c, cfg) => {
  const clean = async () =>
    await del(['.tmp', c.dest('*')], { dot: true })

  gulp.task(clean)
}
