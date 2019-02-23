<template>
   <v-app>
      <router-view></router-view>
   </v-app>
</template>

<script>
   import DataStore from './core/dataStore';

   export default {
      name: 'app',
      data() {
         return {
            sharedData: DataStore.state
         };
      },
      methods: {
         startBgAction() {
            this.sharedData.bgTaskHandler = setInterval(() => {
               console.log('Executing interval');
               //here checking tasks will be done
            }, 5 * 60000);
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
         if (localStorage.reportNumber) this.sharedData.reportNumber = localStorage.reportNumber;
         if (localStorage.dailyTasks) this.sharedData.dailyTasks = localStorage.dailyTasks;
         //if (localStorage.userTasks) this.sharedData.userTasks = localStorage.userTasks;
         if (localStorage.settingsPassword) this.sharedData.settingsPassword = localStorage.settingsPassword;
         this.sharedData.userTasks = this.sharedData.dailyTasks;
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