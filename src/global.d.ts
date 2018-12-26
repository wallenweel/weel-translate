declare module 'vue-property-decorator'
declare module 'vue-mdc-adapter'
declare module 'vue-mdc-adapter/*'
declare module 'vue-perfect-scrollbar'

declare module '*.png'
declare module '*.svg'
declare module '*.json'

// fixing "cannot found module" error for icon components
declare module '@/components/icons/Favorite.vue'
declare module '@/components/icons/VolumeOff.vue'
declare module '@/components/icons/VolumeDown.vue'
declare module '@/components/icons/VolumeUp.vue'

//~ target browser flag for building extension
//~ defined in "/vue.config.js"
declare const TARGET_BROWSER: 'firefox' | 'chrome' | 'opera' | 'web';
declare const RUNTIME_ENV: 'development' | 'production';

//~ Firefox' gloabl
declare const browser: any;

//~ Chrome' gloabl
declare const chrome: any;
