require.context("../img/", true, /\.(jpe?g|png|gif|svg)$/i);
require('es6-promise').polyfill();
import Polyfill from './core/es6-polyfill.js';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueCordova from './device/vue-cordova.js';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import Locale from './language/vue-i18n-locales.js';
import '../css/main.scss';
import store from './store';
import theme from './theme.js';
//---
import App from './app.vue';
import Home from './components/home.vue';
import Instruction from './components/instruction.vue';
import Issue from './components/issue.vue';
import Settings from './components/settings.vue';

(function () {
   "use strict";

   document.addEventListener('deviceready', onDeviceReady.bind(this), false);

   function onDeviceReady() {
      document.addEventListener('pause', onPause.bind(this), false);
      document.addEventListener('resume', onResume.bind(this), false);

      Polyfill.objectAssign();
      Vue.use(Vuetify, { theme, iconfont: 'mdi', options: { customProperties: true } });
      Vue.use(VueCordova);
      Vue.use(VueRouter);
      Vue.use(VueI18n);

      const router = new VueRouter({
         base: __dirname,
         routes: [
            { path: '/', component: Home },
            { path: '/instruction', component: Instruction },
            { path: '/issue', component: Issue },
            { path: '/settings', component: Settings }
         ]
      });

      const i18n = new VueI18n({
         locale: 'pl',
         fallbackLocale: 'pl',
         messages: Locale
      });

      new Vue({ components: { App }, router, i18n, store }).$mount("#app");
   }

   function onPause() { }
   function onResume() { }
})();