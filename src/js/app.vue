<template>
   <v-app>
      <v-snackbar v-model="toast" right top :timeout="toastTimeout">
         {{ feedback }}
         <v-btn color="primary" flat @click="clearToast">{{ $t('common.close') }}</v-btn>
      </v-snackbar>
      <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
         {{ error }}
         <v-btn color="secondary" flat @click="clearErrorToast">{{ $t('common.close') }}</v-btn>
      </v-snackbar>

      <router-view></router-view>
   </v-app>
</template>

<script>
   import ToastMixin from './core/toastMixin';
   import SMSMixin from './core/smsMixin';
   import { mapGetters, mapMutations, mapActions } from 'vuex';

   export default {
      name: 'app',
      mixins: [ToastMixin, SMSMixin],
      data() {
         return {
            checkingInterval: 10,
            bgTaskHandler: null,
            bgMinuteTaskHandler: null
         };
      },
      computed: mapGetters({
         tasksToReport: 'tasks/tasksToReport',
         undoneTasks: 'tasks/undoneTasks'
      }),
      methods: {
         ...mapMutations(['readInitialSettings']),
         ...mapActions({
            resetTasksStatus: 'tasks/resetTasksStatus',
            readInitialTasks: 'tasks/readInitialTasks'
         }),
         startBgAction() {
            const minute = 60000;
            powerManagement.dim();

            this.bgTaskHandler = setInterval(() => {
               console.log("Sending reports");
               this.tasksToReport.forEach(task => {
                  this.sendSmsReport("task_list.task_undone", task.name);
                  setTimeout(() => { }, 200);
               })
            }, this.checkingInterval * minute);

            this.bgMinuteTaskHandler = setInterval(() => {
               const checkTime = new Date();
               if (checkTime.getHours() == 0 && checkTime.getMinutes() == 0) {
                  console.log("Reseting task statuses");
                  this.undoneTasks.forEach(task => {
                     this.sendSmsReport("task_list.task_undone", task.name);
                     setTimeout(() => { }, 200);
                  });
                  this.resetTasksStatus(checkTime);
               }
            }, minute);

            console.log('Background task has started.');
         },
         endBgAction() {
            powerManagement.setReleaseOnPause(false);
            clearInterval(this.bgTaskHandler);
            clearInterval(this.bgMinuteTaskHandler);
            cordova.plugins.backgroundMode.un('enable', this.startBgAction);
            cordova.plugins.backgroundMode.un('disable', this.endBgAction);
            console.log('Background task has stopped.');
         }
      },
      created() {
         this.readInitialSettings();
         this.readInitialTasks();
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