import { Browser } from '@/interfaces';
import firefox from './firefox';

interface TargetBrowsers {
  readonly [name: string]: Browser | object;
}

export default ({
  firefox,
  web: window, // useless
} as TargetBrowsers)[TARGET_BROWSER];
