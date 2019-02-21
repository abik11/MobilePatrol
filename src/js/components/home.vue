<template>
   <v-layout row>
      <login-box v-if="loggedIn" class="login-box full" @login="onUserLoggedin" />
      <v-layout v-else row>

         <v-snackbar v-model="toast" right top :timeout="toastTimeout">
            {{ $t('common.sms_confirmation_send') }}
            <v-btn color="primary" flat @click="toast = false">{{ $t('common.close') }}</v-btn>
         </v-snackbar>
         <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
            {{ error }}
            <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
         </v-snackbar>

         <v-navigation-drawer v-model="nav" absolute dark temporary width="220">
            <v-list class="pt-0">

               <v-list-tile @click="panic">
                  <v-list-tile-content>
                     <v-list-tile-title>{{ $t('side_menu.panic') }}</v-list-tile-title>
                  </v-list-tile-content>
               </v-list-tile>
               <v-divider></v-divider>

               <router-link to="/issue">
                  <v-list-tile>
                     <v-list-tile-content>
                        <v-list-tile-title>{{ $t('side_menu.raport_issue') }}</v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>
               </router-link>
               <v-divider></v-divider>

               <router-link to="/instruction">
                  <v-list-tile>
                     <v-list-tile-content>
                        <v-list-tile-title>{{ $t('side_menu.read_instructions') }}</v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>
               </router-link>
               <v-divider></v-divider>

               <router-link to="/settings">
                  <v-list-tile>
                     <v-list-tile-content>
                        <v-list-tile-title>{{ $t('side_menu.settings') }}</v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>
               </router-link>
               <v-divider></v-divider>

               <v-list-tile @click="sharedData.currentUser = ''">
                  <v-list-tile-content>
                     <v-list-tile-title>{{ $t('side_menu.logout') }}</v-list-tile-title>
                  </v-list-tile-content>
               </v-list-tile>

            </v-list>
         </v-navigation-drawer>

         <v-flex xs12 sm6 offset-sm3>
            <v-list two-line>
               <template v-for="(task, index) in sharedData.userTasks">
                  <v-divider v-if="index > 0" :key="index"></v-divider>
                  <v-list-tile :key="index" @click="taskDone(task)">
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
               <v-layout align-center justify-center fill-height>
                  <v-flex xs3>
                     <v-btn color="primary" fab dark @click.stop="nav = !nav">
                        <v-icon>menu</v-icon>
                     </v-btn>
                  </v-flex>
                  <v-flex xs9 pr-4 class="grey--text text--darken-1 text-xs-right text-truncate">
                     {{$t('login.logged_as')}}: {{sharedData.currentUser}}
                  </v-flex>
               </v-layout>
            </v-card>
         </v-footer>

      </v-layout>
   </v-layout>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorToastMixin from '../core/errorToastMixin';
   import LoginBox from './loginBox.vue';

   export default {
      name: 'home',
      components: { LoginBox },
      mixins: [ErrorToastMixin],
      data() {
         return {
            nav: false,
            toast: false,
            toastTimeout: 2000,
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
            if (taskDone) this.sendSmsReport("task_list.task_done", task.name);
         },
         panic() {
            var sendPanic = confirm(this.$i18n.t("panic.panic_question"));
            if (sendPanic) this.sendSmsReport("panic.panic_send");
         },
         sendSmsReport(titleStringName, optionalContent) {
            if (this.sharedData.reportNumber.length == 0) {
               this.error = this.$i18n.t('common.report_number_error');
               return;
            }

            var title = this.$i18n.t(titleStringName);
            var time = new Date().toLocaleTimeString();
            var separator = "\n";
            if (optionalContent == void 0) {
               optionalContent = '';
               separator = '';
            }

            var message = `${title}\n${this.sharedData.currentUser}\n${time}${separator}${optionalContent}`;

            this.$device.sendSms
               (this.sharedData.reportNumber, message, this.onMessageSent, this.basicErrorHandler);
         },
         onMessageSent() {
            this.toast = true;
            console.log("SMS has been sent");
         },
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
         },
         onUserLoggedin(userName) {
            this.sharedData.currentUser = userName;
         }
      },
      created() {
         if (localStorage.reportNumber) this.sharedData.reportNumber = localStorage.reportNumber;
         if (localStorage.dailyTasks) this.sharedData.dailyTasks = localStorage.dailyTasks;
         //if (localStorage.userTasks) this.sharedData.userTasks = localStorage.userTasks;
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
   /*
      todo:
      - edit tasks in settings module
      - error handling in issue module
      - transitions & animations
   */
</script>

<style lang="scss" scoped>
   .login-box {
      position: fixed;
      top: 0px;
      left: 0px;
   }

   .v-list a {
      text-decoration: none;
      color: white;
   }
</style>