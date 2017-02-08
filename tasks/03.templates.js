import fs from 'fs'
import filter from 'gulp-filter'
import pug from 'gulp-pug'
import replace from 'gulp-replace'

export default (gulp, c, cfg) => {
  /**
   * Getting Files'name of A Path
   * @param  {String} type the name in config's origin property
   * @return {Array}       a collection of these files's name, no postfix
   */
  const getFilesName = type => {
    const files = cfg.getValidFiles(cfg.path.src(cfg[type].cwd.src))

    return files
      .map(k => k.replace(/\.\w+$/, ''))
  }

  const stylesFilenames = getFilesName('styles').join('|')
  const stylesReg = new RegExp(`(\\<link.+href\\=[\\'\\"].*)(${stylesFilenames})(\\.css[\\'\\"].*\\>)`, 'g')

  const scriptsFilenames = getFilesName('scripts').join('|')
  const scriptsReg = new RegExp(`(\\<script.+src\\=[\\'\\"].*)(${scriptsFilenames})(\\.js[\\'\\"].*\\>\\<\\/script\\>)`, 'g')

  const templates = async () => {
    const pugFilter = filter('**/*.pug', { restore: true })
    const htmlFilter = filter('**/*.html')

    return await gulp.src(c.src)
      .pipe(pugFilter)
      .pipe(pug(c.pug))
      .pipe(pugFilter.restore)

      .pipe(htmlFilter)

      .pipe(gulp.if(cfg.env.prod, replace(stylesReg, '$1$2' + cfg.styles.min + '$3')))
      .pipe(gulp.if(cfg.env.prod, replace(scriptsReg, '$1$2' + cfg.scripts.min + '$3')))

      .pipe(gulp.changed(c.dest))
      .pipe(gulp.dest(c.dest))
  }

  gulp.task(templates)
}
