<template>
   <transition name="fade" mode="out-in">
      <v-layout row class="footer-spacer">
         <v-snackbar v-model="toast" right top :timeout="toastTimeout">
            {{ $t('common.saved') }}
            <v-btn color="primary" flat @click="toast = false">{{ $t('common.close') }}</v-btn>
         </v-snackbar>
         <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
            {{ error }}
            <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
         </v-snackbar>

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
                                v-model="reportNumber"
                                :label="$t('settings.phone')"
                                prepend-inner-icon="phone">
                  </v-text-field>
               </v-flex>

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
                           <v-btn color="primary" outline fab @click="editTask(task)">
                              <v-icon>edit</v-icon>
                           </v-btn>
                           <v-btn color="primary" outline fab @click="dailyTasks.splice(index, 1)">
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
   import DataStore from '../core/dataStore';
   import ErrorToastMixin from '../core/errorToastMixin';
   import LoginBox from './auth/loginBox.vue';
   import PasswordBox from './auth/passwordBox.vue';

   export default {
      name: 'settings',
      components: { LoginBox, PasswordBox },
      mixins: [ErrorToastMixin],
      data() {
         return {
            toast: false,
            toastTimeout: 2000,
            dialog: false,
            reportNumber: '',
            dailyTasks: [],
            taskName: '',
            taskTime: null,
            taskId: 0,
            editMode: '',
            authorized: false,
            sharedData: DataStore.state
         }
      },
      computed: {
         passwordSet() {
            return this.sharedData.settingsPassword != '';
         }
      },
      methods: {
         onUserAuthorize(password) {
            if (password == this.sharedData.settingsPassword)
               this.authorized = true;
            else
               this.error = this.$i18n.t('login.wrong_password');
         },
         addTask() {
            this.editMode = 'add';
            this.taskName = '';
            this.taskTime = '00:00';
            var task = _.maxBy(this.dailyTasks, 'id');
            this.taskId = task ? task.id + 1 : 0;
            this.dialog = true;
         },
         editTask(task) {
            this.editMode = 'edit';
            this.taskName = task.name;
            this.taskTime = task.time;
            this.taskId = task.id;
            this.dialog = true;
         },
         saveTasks() {
            if (this.editMode == 'add') {
               if (this.taskName != '') {
                  this.dailyTasks.push({
                     name: this.taskName,
                     time: this.taskTime,
                     id: this.taskId,
                     status: 'undone'
                  });
                  this.dailyTasks = _.orderBy(this.dailyTasks, 'time');
                  this.dialog = false;
               }
               else {
                  this.error = this.$i18n.t('settings.adding_task_error');
               }
            }
            else if (this.editMode == 'edit') {
               if (this.taskName != '') {
                  var editedTask = _.find(this.dailyTasks, ['id', this.taskId]);
                  editedTask.name = this.taskName;
                  editedTask.time = this.taskTime;
                  this.dailyTasks = _.orderBy(this.dailyTasks, 'time');
                  this.dialog = false;
               }
               else {
                  this.error = this.$i18n.t('settings.editing_task_error');
               }
            }
         },
         saveSettings() {
            this.sharedData.reportNumber = this.reportNumber;
            localStorage.reportNumber = this.reportNumber;
            this.sharedData.dailyTasks = _.clone(this.dailyTasks);
            localStorage.dailyTasks = JSON.stringify(this.dailyTasks);
            this.toast = true;
         }
      },
      created() {
         this.reportNumber = this.sharedData.reportNumber;
         this.dailyTasks = _.clone(this.sharedData.dailyTasks);
      }
   }
</script>