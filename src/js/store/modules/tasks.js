export default {
   namespaced: true,
   state: {
      dailyTasks: [
         { name: 'Sprwadź punkt numer 1', time: '18:00', id: 1, status: 'undone', user: '' },
         { name: 'Sprwadź punkt numer 2', time: '18:05', id: 2, status: 'undone', user: '' },
         { name: 'Sprwadź punkt numer 3 A', time: '18:15', id: 3, status: 'undone', user: 'A' },
         { name: 'Sprwadź punkt numer 3 B', time: '18:20', id: 4, status: 'undone', user: 'B' }
      ]
   },
   getters: {
      currentUserTasks: (state, getters, rootState) => {
         console.log(rootState.messages.test);
         return state.dailyTasks.filter(task => task.user == '' || task.user == rootState.currentUser);
      },
      undoneTasks: (state, getters) => {
         return getters.currentUserTasks.filter(task => task.status == 'undone');
      },
      tasksToReport: (state, getters) => {
         const checkTime = new Date();
         const lastCheck = `${checkTime.getHours()}:${checkTime.getMinutes()}`;

         return getters.currentUserTasks.filter
            (task => task.time < lastCheck && task.status == 'undone');
      }
   },
   mutations: {
      readDailyTasks(state) {
         if (localStorage.dailyTasks)
            state.dailyTasks = JSON.parse(localStorage.dailyTasks);
      },
      setTaskStatus(state, payload) {
         payload.task.status = payload.status;
      },
      setDailyTasks(state, dailyTasks) {
         state.dailyTasks = _.cloneDeep(dailyTasks);
      }
   },
   actions: {
      readInitialTasks({ state, commit, dispatch }) {
         commit('readDailyTasks');
         const checkDay = new Date().getDay();
         if (!localStorage.today || localStorage.today != checkDay) {
            state.dailyTasks.forEach(task => commit('setTaskStatus', { task, status: 'undone' }));
            localStorage.today = checkDay;
            dispatch('storeDailyTasks');
         }
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
}