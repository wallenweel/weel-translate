((w, d, flag) => d.body.getAttribute(flag) === 'running'
  ? setTimeout(() => w.location.reload(), 150)
  : d.body.setAttribute(flag, 'running')
)(window, document, 'weel-translate')
