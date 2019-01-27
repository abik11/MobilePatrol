<template>
   <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn">
      <div>
         <ul>
            <li v-for="task in sharedData.tasks" @click="taskDone(task)">{{task.name}} | {{task.time}}</li>
         </ul>
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
            var taskDone = confirm("common.task_done_question");
            if (taskDone) {
               var now = new Date();
               var time = now.toLocaleTimeString();
               var message = this.$i18n.t("common.task_done");
               message = `${message}\n${this.sharedData.currentUser}\n${task.name}\n${time}`;

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