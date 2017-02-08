import uglify from 'gulp-uglify'
import browserify from 'gulp-browserify'
import plumber from 'gulp-plumber'

export default (gulp, c, cfg) => {
  const scripts = async () =>
    await gulp.src(c.src)
      .pipe(plumber())

      .pipe(browserify(c.browserify))

      .pipe(gulp.if(cfg.env.prod, uglify()))
      .pipe(gulp.if(cfg.env.prod, gulp.rename({
        suffix: c.min,
      })))

      .pipe(gulp.changed(c.dest))
      .pipe(gulp.dest(c.dest))

  gulp.task(scripts)
}
