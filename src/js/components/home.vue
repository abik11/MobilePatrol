<template>
   <transition name="fade" mode="out-in">
      <v-layout row class="footer-spacer">
         <transition name="slide" mode="out-in">
            <login-box v-if="!loggedIn" class="login-box full" @login="onUserLoggedin" />
            <v-layout v-else row>

               <v-snackbar v-model="toast" right top :timeout="toastTimeout">
                  {{ $t('common.sms_confirmation_send') }}
                  <v-btn color="primary" flat @click="toast = false">{{ $t('common.close') }}</v-btn>
               </v-snackbar>
               <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
                  {{ error }}
                  <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
               </v-snackbar>

               <v-navigation-drawer v-model="nav" dark temporary fixed width="220">
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

                     <v-list-tile @click="onUserLogout">
                        <v-list-tile-content>
                           <v-list-tile-title>{{ $t('side_menu.logout') }}</v-list-tile-title>
                        </v-list-tile-content>
                     </v-list-tile>

                  </v-list>
               </v-navigation-drawer>

               <v-flex xs12>
                  <v-list two-line>
                     <template v-for="(task, index) in dailyTasks">
                        <v-divider v-if="index > 0" :key="-index"></v-divider>
                        <v-list-tile :key="index">
                           <v-list-tile-content>
                              <strong><v-list-tile-title>{{ task.name }}</v-list-tile-title></strong>
                              <v-list-tile-sub-title>{{ task.time }}</v-list-tile-sub-title>
                           </v-list-tile-content>
                           <v-spacer></v-spacer>
                           <transition name="bounce" mode="out-in">
                              <v-btn v-if="task.status == 'undone'" @click="taskDone(task)"
                                     color="primary" outline fab>
                                 <v-icon>check</v-icon>
                              </v-btn>
                              <v-icon v-else class="px-4" color="success">check</v-icon>
                           </transition>
                        </v-list-tile>
                     </template>
                  </v-list>
               </v-flex>

               <v-footer fixed height="auto">
                  <v-card flat tile color="secondary" style="width: 100%;">
                     <v-layout align-center justify-center fill-height>
                        <v-flex xs3>
                           <v-btn color="primary" fab dark @click.stop="nav = !nav">
                              <v-icon>menu</v-icon>
                           </v-btn>
                        </v-flex>
                        <v-flex xs9 pr-4 class="grey--text text--darken-1 text-xs-right text-truncate">
                           {{$t('login.logged_as')}}: {{currentUser}}
                        </v-flex>
                     </v-layout>
                  </v-card>
               </v-footer>

            </v-layout>
         </transition>
      </v-layout>
   </transition>
</template>

<script>
   import ErrorToastMixin from '../core/errorToastMixin';
   import SMSMixin from '../core/smsMixin';
   import LoginBox from '../auth/loginBox.vue';
   import { mapState, mapGetters } from 'vuex';

   export default {
      name: 'home',
      components: { LoginBox },
      mixins: [ErrorToastMixin, SMSMixin],
      data() {
         return {
            nav: false,
            toast: false,
            toastTimeout: 2000
         }
      },
      computed: {
         ...mapState({
            dailyTasks: state => state.tasks.dailyTasks,
            currentUser: state => state.currentUser
         }),
         ...mapGetters([
            'loggedIn'
         ])
      },
      methods: {
         taskDone(task) {
            var taskDone = confirm(this.$i18n.t("task_list.task_done_question"));
            if (taskDone) {
               this.sendSmsReport("task_list.task_done", task.name);
               this.$store.dispatch('tasks/setTaskStatus', { task, status: 'done' });
            }
         },
         panic() {
            var sendPanic = confirm(this.$i18n.t("panic.panic_question"));
            if (sendPanic) this.sendSmsReport("panic.panic_send");
         },
         onMessageSent() {
            this.toast = true;
            console.log("SMS has been sent");
         },
         onUserLoggedin(userName) {
            this.$store.commit('setCurrentUser', userName);
         },
         onUserLogout() {
            this.nav = false;
            this.$store.commit('setCurrentUser', '');
         }
      }
   }
   /*
      todo:
      - add dexie ?
   */
</script>

<style lang="scss" scoped>
   .v-list a {
      text-decoration: none;
      color: white;
   }
</style>