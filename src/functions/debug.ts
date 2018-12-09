export const isDebug: boolean = RUNTIME_ENV === 'development';
export const debugTag: string = 'Weel Translate X';

export default (() => {
  const tag: string[] = [
    `%c ${debugTag} `,
    'border-radius:4px;background-color:#0074e8;color:white;font-weight: bold;',
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
