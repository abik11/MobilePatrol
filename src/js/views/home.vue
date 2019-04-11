<template>
   <transition name="fade" mode="out-in">
      <v-layout row class="footer-spacer">
         <transition name="slide" mode="out-in">
            <login-box v-if="!loggedIn" class="login-box full" @login="onUserLoggedin" />
            <v-layout v-else row>
               <v-navigation-drawer v-model="nav" dark temporary fixed width="220">
                  <v-toolbar color="success" flat>
                     <v-list>
                        <v-list-tile>
                           <v-list-tile-title class="title">
                              <img src="../../img/logo.png" />
                           </v-list-tile-title>
                        </v-list-tile>
                     </v-list>
                  </v-toolbar>
                  <v-divider></v-divider>
                  <v-list class="pt-0">
                     <v-list-tile @click="panic">
                        <v-list-tile-content>
                           <v-list-tile-title>{{ $t('side_menu.panic') }}</v-list-tile-title>
                        </v-list-tile-content>
                     </v-list-tile>
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
                     <template v-for="(task, index) in currentUserTasks">
                        <v-divider v-if="index > 0" :key="-index"></v-divider>
                        <v-list-tile :key="index">
                           <v-list-tile-content @click="issue(task)">
                              <strong>
                                 <v-list-tile-title>
                                    {{ task.name }}
                                 </v-list-tile-title>
                              </strong>
                              <v-list-tile-sub-title>
                                 {{ task.time }}
                              </v-list-tile-sub-title>
                           </v-list-tile-content>
                           <v-spacer></v-spacer>
                           <transition name="bounce" mode="out-in">
                              <v-btn v-if="task.status == 'undone'" @click="taskDone(task)"
                                     color="error" outline fab>
                                 <v-icon>check</v-icon>
                              </v-btn>
                              <v-icon v-else class="px-4" color="success">check</v-icon>
                           </transition>
                        </v-list-tile>
                     </template>
                  </v-list>
               </v-flex>

               <v-footer fixed height="auto">
                  <v-card flat tile color="primary" style="width: 100%;">
                     <v-layout align-center justify-center fill-height>
                        <v-flex xs3>
                           <v-btn color="success" fab dark @click.stop="nav = !nav">
                              <v-icon>menu</v-icon>
                           </v-btn>
                        </v-flex>
                        <v-flex xs9 pr-4 class="text-xs-right text-truncate green--text text--lighten-1">
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
   import SMSMixin from '../core/smsMixin';
   import LoginBox from '../auth/loginBox.vue';
   import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

   export default {
      name: 'home',
      components: { LoginBox },
      mixins: [SMSMixin],
      data() {
         return {
            nav: false
         }
      },
      computed: {
         ...mapState({
            currentUser: state => state.currentUser
         }),
         ...mapGetters({
            currentUserTasks: 'tasks/currentUserTasks',
            loggedIn: 'loggedIn'
         })
      },
      methods: {
         ...mapMutations({
            setCurrentUser: 'setCurrentUser',
            setFeedback: 'messages/setFeedback'
         }),
         ...mapActions({
            setTaskStatus: 'tasks/setTaskStatus'
         }),
         taskDone(task) {
            var taskDone = confirm(this.$i18n.t("task_list.task_done_question"));
            if (taskDone) {
               this.sendSmsReport('task_list.task_done', task.name, 'common.sms_confirmation_send');
               this.setTaskStatus({ task, status: 'done' });
            }
         },
         panic() {
            var sendPanic = confirm(this.$i18n.t('panic.panic_question'));
            if (sendPanic) this.sendSmsReport('panic.panic_send', '', 'common.sms_confirmation_send');
         },
         issue(task) {
            var sendIssue = confirm(this.$i18n.t('issue.issue_question'));
            if (sendIssue) this.$router.push(`/issue/${task.name}`);
         },
         onUserLoggedin(userName) {
            this.setCurrentUser(userName);
         },
         onUserLogout() {
            this.nav = false;
            this.setCurrentUser('');
         }
      }
   }
</script>

<style lang="scss" scoped>
   .v-list a {
      text-decoration: none;
      color: white;
   }

   .v-navigation-drawer {
      background-color: var(--v-primary-base);
   }
</style>