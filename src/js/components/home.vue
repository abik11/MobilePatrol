<template>
   <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn">
      <div>
         <ul>
            <li v-for="task in sharedData.tasks" @click="taskDone(task)">{{task.name}} | {{task.time}}</li>
         </ul>
         <hr />
         <p><router-link to="/instructions">{{$t('task_list.read_instructions')}}</router-link></p>
         <p><router-link to="/issue">{{$t('task_list.raport_issue')}}</router-link></p>
         <p><a href="#" @click="panic">{{$t('task_list.panic')}}</a></p>
      </div>
   </transition>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorMixin from '../core/errorMixin';

   export default {
      name: 'home',
      mixins: [ErrorMixin],
      data: function () {
         return {
            error: '',
            sharedData: DataStore.state
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
         }
      }
   }
</script>