import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      appVersion: '1.0',
      settingsPassword: '',
      dailyTasks: [
         { name: 'Sprwadź punkt numer 1', time: '18:00', id: 1, status: 'undone' },
         { name: 'Sprwadź punkt numer 2', time: '18:05', id: 2, status: 'undone' },
         { name: 'Sprwadź punkt numer 3', time: '18:15', id: 3, status: 'undone' }
      ],
      reportNumber: '',
      currentUser: ''
   },

   getters: {
      loggedIn: state => {
         return state.currentUser != '';
      },
      passwordSet: state => {
         return state.settingsPassword != '';
      },
      undoneTasks: state => {
         return state.dailyTasks.forEach(task => task.status == 'undone');
      },
      tasksToReport: state => {
         const checkTime = new Date();
         const lastCheck = `${checkTime.getHours()}:${checkTime.getMinutes()}`;

         return state.dailyTasks.filter
            (task => task.time < lastCheck && task.status == 'undone');
      }
   },

   mutations: {
      readInitialState(state) {
         if (localStorage.dailyTasks)
            state.dailyTasks = JSON.parse(localStorage.dailyTasks);

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
      },
      setTaskStatus(state, payload) {
         payload.task.status = payload.status;
      },
      setDailyTasks(state, dailyTasks) {
         state.dailyTasks = _.cloneDeep(dailyTasks);
      }
   },

   actions: {
      checkInitialState({ state, commit, dispatch }) {
         const checkDay = new Date().getDay();
         if (!localStorage.today || localStorage.today != checkDay) {
            state.dailyTasks.forEach(task => commit('setTaskStatus', { task, status: 'undone' }));
            localStorage.today = checkDay;
            dispatch('storeDailyTasks');
         }
      },
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
      },
      setTaskStatus({ commit, dispatch }, payload) {
         commit('setTaskStatus', payload);
         dispatch('storeDailyTasks');
      },
      storeDailyTasks({ state }) {
         localStorage.dailyTasks = JSON.stringify(state.dailyTasks);
      },
      setDailyTasks({ commit, dispatch }, dailyTasks) {
         commit('setDailyTasks', dailyTasks);
         dispatch('storeDailyTasks');
      },
      resetTasksStatus({ state, commit, dispatch }, resetTime) {
         state.dailyTasks.forEach(task => commit('setTaskStatus', { task, status: 'undone' }));
         dispatch('storeDailyTasks');
         localStorage.today = resetTime.getDay();
      }
   }
});