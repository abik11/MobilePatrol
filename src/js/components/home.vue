<template>
   <v-layout row>
      <login-box v-if="loggedIn" class="full" @login="onUserLoggedin" />
      <v-layout v-else row>
         <v-flex xs12 sm6 offset-sm3>
            <v-list two-line>
               <template v-for="(task, index) in sharedData.userTasks">
                  <v-divider v-if="index > 0" :key="index"></v-divider>
                  <v-list-tile :key="index">
                     <v-list-tile-content>
                        <strong><v-list-tile-title v-html="task.name"></v-list-tile-title></strong>
                        <v-list-tile-sub-title v-html="task.time"></v-list-tile-sub-title>
                     </v-list-tile-content>
                     <v-spacer></v-spacer>
                     <v-btn color="primary" outline fab @click="sendName">
                        <v-icon>check</v-icon>
                     </v-btn>
                  </v-list-tile>
               </template>
            </v-list>
         </v-flex>
         <v-footer absolute height="auto">
            <v-card flat tile color="secondary" style="width: 100%;">
               <v-card-text>
                  <v-btn color="primary" fab dark>
                     <v-icon>menu</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <p class="grey--text text--darken-1">
                     {{$t('task_list.logged_as')}}: {{sharedData.currentUser}}
                  </p>
               </v-card-text>
            </v-card>
         </v-footer>
      </v-layout>
   </v-layout>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorMixin from '../core/errorMixin';
   import LoginBox from './loginBox.vue';

   export default {
      name: 'home',
      components: { LoginBox },
      mixins: [ErrorMixin],
      data() {
         return {
            error: '',
            sharedData: DataStore.state
         }
      },
      computed: {
         loggedIn() {
            return this.sharedData.currentUser == '';
         }
      },
      methods: {
         taskDone(task) {
            var taskDone = confirm(this.$i18n.t("task_list.task_done_question"));
            if (taskDone) {
               var now = new Date();
               var time = now.toLocaleTimeString();
               var message = this.$i18n.t("task_list.task_done");
               message = `${message}\n${this.sharedData.currentUser}\n${task.name}\n${time}`;

               this.$device.sendSms(
                  this.sharedData.reportNumber,
                  message,
                  this.onMessageSent,
                  this.basicErrorHandler
               );
            }
         },
         panic() {
            var sendPanic = confirm(this.$i18n.t("task_list.panic_question"));
            if (sendPanic) {
               var now = new Date();
               var time = now.toLocaleTimeString();
               var message = this.$i18n.t("task_list.panic");
               message = `${message}\n${this.sharedData.currentUser}\n${time}`;

               this.$device.sendSms(
                  this.sharedData.reportNumber,
                  message,
                  this.onMessageSent,
                  this.basicErrorHandler
               );
            }
         },
         onMessageSent() {
            console.log("SMS has been sent");
         },
         startBgAction() {
            this.sharedData.bgTaskHandler = setInterval(() => {
               console.log('Executing interval');
               //here checking tasks will be done
            }, /*5 **/ 60000);
            this.sharedData.bgTaskActive = true;
            console.log('Background task has started.');
         },
         endBgAction() {
            clearInterval(this.sharedData.taskHandler);
            cordova.plugins.backgroundMode.un('enable', this.startBgAction);
            cordova.plugins.backgroundMode.un('disable', this.endBgAction);
            this.sharedData.bgTaskActive = false;
            console.log('Background task has stopped.');
         },
         onUserLoggedin(userName) {
            this.sharedData.currentUser = userName;
         }
      },
      created() {
         this.sharedData.userTasks = this.sharedData.dailyTasks;
         this.sharedData.reportNumber = '797026001';
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

<style lang="scss" scoped>
   .full {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
   }
</style>