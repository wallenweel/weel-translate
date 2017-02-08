import spritesmith from 'gulp.spritesmith'

export default (gulp, c, cfg) => {
  const sprites = async () =>
    await gulp.src(c.src)
      .pipe(spritesmith(c.params))
      .pipe(gulp.dest(c.dest))

  gulp.task(sprites)
}
