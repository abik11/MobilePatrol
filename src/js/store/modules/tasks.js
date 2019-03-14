export default {
   namespaced: true,
   state: {
      dailyTasks: [
         { name: 'Sprwadź punkt numer 1', time: '18:00', id: 1, status: 'undone' },
         { name: 'Sprwadź punkt numer 2', time: '18:05', id: 2, status: 'undone' },
         { name: 'Sprwadź punkt numer 3', time: '18:15', id: 3, status: 'undone' }
      ]
   },
   getters: {
      undoneTasks: state => {
         return state.dailyTasks.filter(task => task.status == 'undone');
      },
      tasksToReport: state => {
         const checkTime = new Date();
         const lastCheck = `${checkTime.getHours()}:${checkTime.getMinutes()}`;

         return state.dailyTasks.filter
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