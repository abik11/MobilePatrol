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
            lastCheckHour: null,
            lastCheckMinute: null,
            sharedData: DataStore.state
         };
      },
      methods: {
         startBgAction() {
            this.sharedData.bgTaskHandler = setInterval(() => {
               var checkTime = new Date();
               this.lastCheckHour = checkTime.getHours();
               this.lastCheckMinute = checkTime.getMinutes();
               var lastCheck = `${this.lastCheckHour}:${this.lastCheckMinute}`;
               console.log(`Executing interval - last check: ${lastCheck}`);

               if (lastCheck == this.sharedData.taskResetHour)
                  _.forEach(this.sharedData.dailyTasks, task => {
                     task.status = 'undone';
                  });

               //here checking tasks will be done
            }, 60000);
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