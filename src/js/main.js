require.context("../img/", true, /\.(jpe?g|png|gif|svg)$/i);
require('es6-promise').polyfill();
import Polyfill from './core/es6-polyfill.js';
import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors'
import VueCordova from './device/vue-cordova.js';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import Locale from './language/vue-i18n-locales.js';
import '../css/main.scss';
//---
import Home from './components/home.vue';
import Instruction from './components/instruction.vue';
import Issue from './components/issue.vue';

(function () {
   "use strict";

   document.addEventListener('deviceready', onDeviceReady.bind(this), false);

   function onDeviceReady() {
      document.addEventListener('pause', onPause.bind(this), false);
      document.addEventListener('resume', onResume.bind(this), false);

      Polyfill.objectAssign();
      Vue.use(Vuetify, {
         iconfont: 'mdi',
         theme: {
            primary: colors.orange.darken4,
            secondary: colors.grey.darken4
         }
      });
      Vue.use(VueCordova);
      Vue.use(VueRouter);
      Vue.use(VueI18n);

      const router = new VueRouter({
         base: __dirname,
         routes: [
            { path: '/', component: Home },
            { path: '/instruction', component: Instruction },
            { path: '/issue', component: Issue }
         ]
      });

      const i18n = new VueI18n({
         locale: 'pl',
         fallbackLocale: 'pl',
         messages: Locale
      });

      new Vue({ router, i18n }).$mount("#app");
   }

   function onPause() { }
   function onResume() { }
})();