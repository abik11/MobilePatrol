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
            lastCheckHour: null,
            lastCheckMinute: null,
            checkingInterval: 10,
            sharedData: DataStore.state
         };
      },
      methods: {
         startBgAction() {
            this.sharedData.bgTaskHandler = setInterval(() => {
               var checkTime = new Date();

               if (checkTime.getHours() == 0 && this.lastCheckHour == 23) {
                  var taskToReset = _.filter(this.sharedData.dailyTasks,
                     task => task.time > `00:${this.checkingInterval}`);
                  _.forEach(taskToReset, task => task.status = 'undone');
               }

               this.lastCheckHour = checkTime.getHours();
               this.lastCheckMinute = checkTime.getMinutes();
               var lastCheck = `${this.lastCheckHour}:${this.lastCheckMinute}`;

               var taskToReport = _.filter(this.sharedData.dailyTasks,
                  task => task.time < lastCheck && task.status == 'undone');

               _.forEach(taskToReport,
                  task => this.sendSmsReport("task_list.task_undone", task.name));
            }, this.checkingInterval * 60000);

            this.sharedData.bgTaskActive = true;
            console.log('Background task has started.');
         },
         endBgAction() {
            clearInterval(this.sharedData.taskHandler);
            cordova.plugins.backgroundMode.un('enable', this.startBgAction);
            cordova.plugins.backgroundMode.un('disable', this.endBgAction);
            this.sharedData.bgTaskActive = false;
            console.log('Background task has stopped.');
         }
      },
      created() {
         if (localStorage.dailyTasks) this.sharedData.dailyTasks = JSON.parse(localStorage.dailyTasks);
         if (localStorage.reportNumber) this.sharedData.reportNumber = localStorage.reportNumber;
         if (localStorage.settingsPassword) this.sharedData.settingsPassword = localStorage.settingsPassword;

         //var today = new Date().getDay();
         //if (!localStorage.today || localStorage.today != today) {
         //   _.forEach(this.sharedData.dailyTasks, task => task.status = 'undone');
         //}
         //localStorage.today = today;
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