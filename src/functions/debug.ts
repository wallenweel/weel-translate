export const isDebug: boolean = RUNTIME_ENV === 'development';

type consoleType = 'log' | 'warn' | 'error' | 'info' | 'trace';

export default (() => {
  const tag: string[] = [
    '%c Weel Translate X ',
    'border-radius:4px;background-color:#0074e8;color:white;font-weight: bold;',
  ];

  const cls: { [type: string]: any; } = {};

  for (const m of Object.keys(console)) {
    if (isDebug) {
      cls[m] = console[m as consoleType].bind(window.console, ...tag);
    } else {
      cls[m] = (): void => {/** production mode */ };
    }
  }

  return cls;
})();
