<template>
   <v-app>
      <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
         {{ error }}
         <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
      </v-snackbar>

      <router-view></router-view>
   </v-app>
</template>

<script>
   import DataStore from './core/dataStore';
   import ErrorToastMixin from './core/errorToastMixin';
   import SMSMixin from './core/smsMixin';

   export default {
      name: 'app',
      mixins: [ErrorToastMixin, SMSMixin],
      data() {
         return {
            checkingInterval: 10,
            sharedData: DataStore.state
         };
      },
      methods: {
         startBgAction() {
            this.sharedData.bgTaskHandler = setInterval(() => {
               var checkTime = new Date();
               var lastCheck = `${checkTime.getHours()}:${checkTime.getMinutes()}`;

               var taskToReport = this.sharedData.dailyTasks.filter
                  (task => task.time < lastCheck && task.status == 'undone');
               taskToReport.forEach
                  (task => this.sendSmsReport("task_list.task_undone", task.name));
            }, this.checkingInterval * 60000);

            this.sharedData.bgMinuteTaskHandler = setInterval(() => {
               var checkTime = new Date();
               if (checkTime.getHours() == 0 && checkTime.getMinutes == 0) {
                  this.sharedData.dailyTasks.forEach(task => {
                     if (task.status == 'undone')
                        this.sendSmsReport("task_list.task_undone", task.name);
                     else
                        task.status = 'undone'
                  });

                  localStorage.today = checkTime.getDay();
               }
            }, 60000);

            this.sharedData.bgTaskActive = true;
            console.log('Background task has started.');
         },
         endBgAction() {
            clearInterval(this.sharedData.bgTaskHandler);
            clearInterval(this.sharedData.bgMinuteTaskHandler);
            cordova.plugins.backgroundMode.un('enable', this.startBgAction);
            cordova.plugins.backgroundMode.un('disable', this.endBgAction);
            this.sharedData.bgTaskActive = false;
            console.log('Background task has stopped.');
         },
         checkOnStart() {
            var checkDay = new Date().getDay();
            if (!localStorage.today || localStorage.today != checkDay) {
               this.sharedData.dailyTasks.forEach(task => task.status = 'undone');
               localStorage.today = checkDay;
            }
         }
      },
      created() {
         if (localStorage.dailyTasks) this.sharedData.dailyTasks = JSON.parse(localStorage.dailyTasks);
         if (localStorage.reportNumber) this.sharedData.reportNumber = localStorage.reportNumber;
         if (localStorage.settingsPassword) this.sharedData.settingsPassword = localStorage.settingsPassword;
         this.checkOnStart();
      },
      mounted() {
         cordova.plugins.backgroundMode.enable();
         cordova.plugins.backgroundMode.on('enable', this.startBgAction);
         cordova.plugins.backgroundMode.on('disable', this.endBgAction);
      },
      beforeDestroy() {
         this.endBgAction();
      }
   }
</script>