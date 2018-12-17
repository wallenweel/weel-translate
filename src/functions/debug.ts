import { extensionName, isDebug, env } from '@/variables';

export default (() => {
  const style = `font-family:sans-serif;display:inline-block;padding-bottom:.5px;`;
  const tag: string[] = [
    `%c  ${extensionName}  %c  ${env}  `,
    `${style}border-radius:3px 0 0 3px;background:#6200ee;color:#f7f7f7;`,
    `${style}border-radius:0 3px 3px 0;background:#505050;color:#9f9f9f;font-style:italic;`,
  ];

  let debug: { [type: string]: (...args: any[]) => void };

  if (isDebug) {
    debug = {
      // tslint:disable-next-line:no-console
      log: console.log.bind(window.console, ...tag),
      // tslint:disable-next-line:no-console
      warn: console.warn.bind(window.console, ...tag),
      // tslint:disable-next-line:no-console
      error: console.error.bind(window.console, ...tag),
      // tslint:disable-next-line:no-console
      info: console.info.bind(window.console, ...tag),
    };
  } else {
    debug = ['log', 'warn', 'error', 'info'].reduce((p: any, c) => {
      p[c] = () => {/** production mode */};
      return p;
    }, {});
  }

  return debug;
})();
