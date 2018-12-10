export const isDebug: boolean = RUNTIME_ENV === 'development';
export const debugTag: string = 'weel-translate-x';

export default (() => {
  const tag: string[] = [
    `%c ${debugTag} %c debug `,
    'border-radius:2px 0 0 2px;background:#505057;color:#f7f7f7;',
    'border-radius:0 2px 2px 0;background:#4f3896;color:#7f7fff;',
  ];

  let mock: { [type: string]: (...args: any[]) => void };

  if (isDebug) {
    mock = {
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
    mock = ['log', 'warn', 'error', 'info'].reduce((p: any, c) => {
      p[c] = () => {/** production mode */};
      return p;
    }, {});
  }

  return mock;
  // const cls: { [type: string]: any; } = {};

  // for (const m of Object.keys(console)) {
  //   if (isDebug) {
  //     cls[m] = console[m as consoleType].bind(window.console, ...tag);
  //   } else {
  //     cls[m] = (): void => {/** production mode */ };
  //   }
  // }

  // return cls;
})();
