export default (gulp, c, cfg) => {
  const test = async () => {
    // console.log(process.argv)
    console.log(cfg.templates.src)
  }

  gulp.task(test)
}
