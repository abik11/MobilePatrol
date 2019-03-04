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
   import ErrorToastMixin from './core/errorToastMixin';
   import SMSMixin from './core/smsMixin';
   import { mapGetters } from 'vuex';

   export default {
      name: 'app',
      mixins: [ErrorToastMixin, SMSMixin],
      data() {
         return {
            checkingInterval: 10,
            bgTaskHandler: null,
            bgMinuteTaskHandler: null
         };
      },
      computed: mapGetters([
         'tasksToReport',
         'undoneTasks'
      ]),
      methods: {
         startBgAction() {
            const minute = 60000;

            this.bgTaskHandler = setInterval(() => {
               this.tasksToReport.forEach(task => {
                  this.sendSmsReport("task_list.task_undone", task.name);
                  setTimeout(() => { }, 500);
               });
            }, this.checkingInterval * minute);

            this.bgMinuteTaskHandler = setInterval(() => {
               const checkTime = new Date();
               if (checkTime.getHours() == 0 && checkTime.getMinutes() == 0) {
                  this.undoneTasks.forEach(task => {
                     this.sendSmsReport("task_list.task_undone", task.name);
                     setTimeout(() => { }, 500);
                  });
                  this.$store.dispatch('resetTasksStatus', checkTime);
               }
            }, minute);
            console.log('Background task has started.');
         },
         endBgAction() {
            clearInterval(this.bgTaskHandler);
            clearInterval(this.bgMinuteTaskHandler);
            cordova.plugins.backgroundMode.un('enable', this.startBgAction);
            cordova.plugins.backgroundMode.un('disable', this.endBgAction);
            console.log('Background task has stopped.');
         }
      },
      created() {
         this.$store.commit('readInitialState');
         this.$store.dispatch('checkInitialState');
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