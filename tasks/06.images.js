import imagemin from 'gulp-imagemin'

export default (gulp, c, cfg) => {
  const images = async () =>
    await gulp.src(c.src)
      .pipe(gulp.if(cfg.env.prod, imagemin(c.imagemin)))

      .pipe(gulp.changed(c.dest))
      .pipe(gulp.dest(c.dest))

  gulp.task(images)
}
