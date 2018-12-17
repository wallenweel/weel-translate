declare module 'vue-property-decorator'
declare module 'vue-mdc-adapter'
declare module 'vue-mdc-adapter/*'
declare module 'vue-perfect-scrollbar'

declare module '*.png';
declare module '*.json';

//~ target browser flag for building extension
//~ defined in "/vue.config.js"
declare const TARGET_BROWSER: 'firefox' | 'chrome' | 'opera' | 'web';
declare const RUNTIME_ENV: 'development' | 'production';

//~ Firefox' gloabl
declare const browser: any;

//~ Chrome' gloabl
declare const chrome: any;
