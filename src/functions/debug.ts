export const isDebug: boolean = RUNTIME_ENV === 'development';
export const debugTag: string = 'weel-translate-x';

export default (() => {
  const style = `font-family:sans-serif;display:inline-block;padding-bottom:.5px;`;
  const tag: string[] = [
    `%c  ${debugTag}  %c  Debug  `,
    `${style}border-radius:3px 0 0 3px;background:#6200ee;color:#f7f7f7;`,
    `${style}border-radius:0 3px 3px 0;background:#505050;color:#9f9f9f;font-style:italic;`,
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
