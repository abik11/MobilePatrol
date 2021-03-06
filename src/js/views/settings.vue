﻿<template>
   <transition name="fade" mode="out-in">
      <v-layout row class="footer-spacer">
         <v-dialog v-model="dialog" max-width="280px">
            <v-card>
               <v-card-text>
                  <v-layout wrap>
                     <v-flex xs12>
                        <v-text-field v-model="taskName" :label="$t('settings.task_name')">
                        </v-text-field>
                     </v-flex>
                     <v-flex xs12>
                        <v-time-picker v-model="taskTime" color="primary" format="24hr" width="220">
                        </v-time-picker>
                     </v-flex>
                     <v-flex xs12>
                        <v-text-field v-model="taskUser" 
                                      :label="$t('settings.task_user')"
                                      append-icon="account_circle"
                                      @click:append="addCurrentUserName">
                        </v-text-field>
                     </v-flex>
                  </v-layout>
               </v-card-text>
               <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="saveTasks">{{ $t('common.save') }}</v-btn>
               </v-card-actions>
            </v-card>
         </v-dialog>

         <transition name="slide" mode="out-in">
            <password-box v-if="!passwordSet" class="login-box full" />
            <login-box v-else-if="!authorized" class="login-box full" type="pass" @login="onUserAuthorize" />
            <v-layout v-else column>
               <v-flex xs12 text-xs-left>
                  <v-text-field box color="primary"
                                v-model="tmpReportNumber"
                                :label="$t('settings.phone')"
                                prepend-inner-icon="phone">
                  </v-text-field>
               </v-flex>

               <v-flex xs12 class="text-xs-center" mb-3>
                  <v-btn color="primary" @click="resetPassword">
                     {{ $t('settings.change_pass') }}
                  </v-btn>
               </v-flex>

               <v-flex xs12>
                  <v-list two-line>
                     <template v-for="(task, index) in tmpDailyTasks">
                        <v-divider v-if="index > 0" :key="-index"></v-divider>
                        <v-list-tile :key="index">
                           <v-list-tile-content>
                              <strong><v-list-tile-title>{{ task.name }}</v-list-tile-title></strong>
                              <v-list-tile-sub-title>{{ task.time }} {{ task.user }}</v-list-tile-sub-title>
                           </v-list-tile-content>
                           <v-spacer></v-spacer>
                           <v-btn color="secondary" outline fab @click="editTask(task)">
                              <v-icon>edit</v-icon>
                           </v-btn>
                           <v-btn color="error" outline fab @click="tmpDailyTasks.splice(index, 1)">
                              <v-icon>close</v-icon>
                           </v-btn>
                        </v-list-tile>
                     </template>
                  </v-list>
               </v-flex>

               <v-footer fixed height="auto">
                  <v-layout align-center justify-center fill-height>
                     <v-flex xs6 class="text-xs-left">
                        <v-btn color="primary" fab dark @click="addTask">
                           <v-icon>add</v-icon>
                        </v-btn>
                     </v-flex>
                     <v-flex xs6 class="text-xs-right">
                        <v-btn color="primary" fab dark @click="saveSettings">
                           <v-icon>save</v-icon>
                        </v-btn>
                     </v-flex>
                  </v-layout>
               </v-footer>
            </v-layout>
         </transition>
      </v-layout>
   </transition>
</template>

<script>
   import LoginBox from '../auth/loginBox.vue';
   import PasswordBox from '../auth/passwordBox.vue';
   import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

   export default {
      name: 'settings',
      components: { LoginBox, PasswordBox },
      data() {
         return {
            dialog: false,
            tmpReportNumber: '',
            tmpDailyTasks: [],
            taskName: '',
            taskTime: null,
            taskId: 0,
            taskUser: '',
            editMode: '',
            authorized: false
         }
      },
      computed: {
         ...mapState({
            dailyTasks: state => state.tasks.dailyTasks,
            settingsPassword: state => state.settingsPassword,
            reportNumber: state => state.reportNumber,
            currentUser: state => state.currentUser
         }),
         ...mapGetters(['passwordSet'])
      },
      methods: {
         ...mapMutations({
            setSettingsPassword: 'setSettingsPassword',
            setFeedback: 'messages/setFeedback',
            setError: 'messages/setError'
         }),
         ...mapActions({
            setReportNumber: 'setReportNumber',
            setDailyTasks: 'tasks/setDailyTasks'
         }),
         onUserAuthorize(password) {
            if (password == this.settingsPassword)
               this.authorized = true;
            else
               this.setError(this.$i18n.t('login.wrong_password'));
         },
         resetPassword() {
            this.authorized = '';
            this.setSettingsPassword('');
         },
         addTask() {
            this.editMode = 'add';
            this.taskName = '';
            this.taskTime = '00:00';
            var task = _.maxBy(this.tmpDailyTasks, 'id');
            this.taskId = task ? task.id + 1 : 0;
            this.taskUser = '';
            this.dialog = true;
         },
         editTask(task) {
            this.editMode = 'edit';
            this.taskName = task.name;
            this.taskTime = task.time;
            this.taskId = task.id;
            this.taskUser = task.user;
            this.dialog = true;
         },
         saveTasks() {
            if (this.editMode == 'add') {
               if (this.taskName != '') {
                  this.tmpDailyTasks.push({
                     name: this.taskName,
                     time: this.taskTime,
                     id: this.taskId,
                     status: 'undone',
                     user: this.taskUser
                  });
                  this.tmpDailyTasks = _.orderBy(this.tmpDailyTasks, 'time');
                  this.dialog = false;
               }
               else {
                  this.setError(this.$i18n.t('settings.adding_task_error'));
               }
            }
            else if (this.editMode == 'edit') {
               if (this.taskName != '') {
                  var editedTask = _.find(this.tmpDailyTasks, ['id', this.taskId]);
                  editedTask.name = this.taskName;
                  editedTask.time = this.taskTime;
                  editedTask.user = this.taskUser;
                  this.tmpDailyTasks = _.orderBy(this.tmpDailyTasks, 'time');
                  this.dialog = false;
               }
               else {
                  this.setError(this.$i18n.t('settings.editing_task_error'));
               }
            }
         },
         saveSettings() {
            this.setReportNumber(this.tmpReportNumber);
            this.setDailyTasks(this.tmpDailyTasks);
            this.setFeedback(this.$i18n.t('common.saved'));
         },
         addCurrentUserName() {
            this.taskUser = this.currentUser;
         }
      },
      created() {
         this.tmpReportNumber = this.reportNumber;
         this.tmpDailyTasks = _.cloneDeep(this.dailyTasks);
      }
   }
</script>