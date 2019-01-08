import { extensionName, isDebug, env, isRelease, theme } from '@/variables';

export default (() => {
  const style = `font-family:sans-serif;display:inline-block;padding-bottom:.5px;`;
  const tag: string[] = [
    `%c  ${extensionName}  %c  ${env}  `,
    `${style}border-radius:3px 0 0 3px;background:${theme.color.primary};color:#f7f7f7;`,
    `${style}border-radius:0 3px 3px 0;background:#505050;color:#9f9f9f;font-style:italic;`,
  ];

  // tslint:disable-next-line:no-console
  const log = console.log.bind(window.console, ...tag) as consoleMethod;
  // tslint:disable-next-line:no-console
  const warn = console.warn.bind(window.console, ...tag) as consoleMethod;
  // tslint:disable-next-line:no-console
  const error = console.error.bind(window.console, ...tag) as consoleMethod;
  // tslint:disable-next-line:no-console
  const info = console.info.bind(window.console, ...tag) as consoleMethod;

  const out: { [type: string]: (...args: any[]) => undefined } = {
    log, warn, error, info,
  };

  if (isRelease) {
    out.log = () => undefined;
  }

  return out;
})();

type consoleMethod = (...args: any[]) => undefined;
