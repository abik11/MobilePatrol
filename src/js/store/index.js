import Vue from 'vue';
import Vuex from 'vuex';
import tasks from './modules/tasks';
   
Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      tasks
   },
   state: {
      appVersion: '1.0',
      settingsPassword: '',
      reportNumber: '',
      currentUser: ''
   },
   getters: {
      loggedIn: state => {
         return state.currentUser != '';
      },
      passwordSet: state => {
         return state.settingsPassword != '';
      }
   },
   mutations: {
      readInitialSettings(state) {
         if (localStorage.reportNumber)
            state.reportNumber = localStorage.reportNumber;

         if (localStorage.settingsPassword)
            state.settingsPassword = localStorage.settingsPassword
      },
      setCurrentUser(state, userName) {
         state.currentUser = userName;
      },
      setReportNumber(state, reportNumber) {
         state.reportNumber = reportNumber;
      },
      setSettingsPassword(state, password) {
         state.settingsPassword = password;
      }
   },
   actions: {
      storeReportNumber({ state }, reportNumber) {
         localStorage.reportNumber = reportNumber;
      },
      setReportNumber({ commit, dispatch }, reportNumber) {
         commit('setReportNumber', reportNumber);
         dispatch('storeReportNumber', reportNumber);
      },
      storeSettingsPassword({ state }, password) {
         localStorage.settingsPassword = password;
      },
      setSettingsPassword({ commit, dispatch }, password) {
         commit('setSettingsPassword', password);
         dispatch('storeSettingsPassword', password);
      }
   }
});