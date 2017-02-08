import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'

export default (gulp, c, cfg) => {
  const styles = async () =>
    await gulp.src(c.src)
      .pipe(sass(c.sass)).on('error', sass.logError)

      .pipe(autoprefixer(c.autoprefixer))

      .pipe(gulp.if(cfg.env.prod, cssnano()))
      .pipe(gulp.if(cfg.env.prod, gulp.rename({
        suffix: c.min,
      })))

      .pipe(gulp.changed(c.dest))
      .pipe(gulp.dest(c.dest))

  gulp.task(styles)
}
