declare module 'vue-property-decorator'
declare module 'vue-mdc-adapter'
declare module 'vue-mdc-adapter/*'
declare module 'vue-perfect-scrollbar'
declare module 'vue-color'

declare module '*.png'
declare module '*.svg'
declare module '*.json'

// fixing "cannot found module" error for icon components
declare module '@/components/icons/Favorite.vue'
declare module '@/components/icons/VolumeOff.vue'
declare module '@/components/icons/VolumeDown.vue'
declare module '@/components/icons/VolumeUp.vue'
declare module '@/components/icons/Menu.vue'
declare module '@/components/icons/Done.vue'
declare module '@/components/icons/KeyboardArrowLeft.vue'
declare module '@/components/icons/KeyboardArrowRight.vue'
declare module '@/components/icons/Translate.vue'
declare module '@/components/icons/History.vue'
declare module '@/components/icons/Settings.vue'
declare module '@/components/icons/Style.vue'
declare module '@/components/icons/GTranslate.vue'
declare module '@/components/icons/SwapHoriz.vue'
declare module '@/components/icons/Pageview.vue'
declare module '@/components/icons/Delete.vue'
declare module '@/components/icons/Feedback.vue'
declare module '@/components/icons/Github.vue'

//~ target browser flag for building extension
//~ defined in "/vue.config.js"
declare const TARGET_BROWSER: 'firefox' | 'chrome' | 'opera' | 'web';
declare const RUNTIME_ENV: 'development' | 'production';

//~ Firefox' gloabl
declare const browser: any;

//~ Chrome' gloabl
declare const chrome: any;
