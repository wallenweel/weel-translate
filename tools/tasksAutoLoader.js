import gulp from 'gulp'
import changed from 'gulp-changed'
import $if from 'gulp-if'
import rename from 'gulp-rename'
import sourcemaps from 'gulp-sourcemaps'

import { config } from '../config'

gulp.changed = changed
gulp.if = $if
gulp.rename = rename
gulp.sourcemaps = sourcemaps

// Get gulp tasks's path synchronously
const tasks = config.tasks.files

export default tasks.forEach(async task =>
  await require(config.path.tasks(task))
    .default(gulp, config[task.replace(/^\d{1,3}\.(.+)\.js$/, '$1')], config)
)
