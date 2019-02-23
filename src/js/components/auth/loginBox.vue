<template>
   <v-layout align-center justify-center row fill-height>
      <v-flex xs12>
         <form @submit.prevent="sendCredentials">
            <v-layout align-center justify-center column fill-height>
               <v-flex xs12 v-if="!secure">
                  <v-text-field color="primary"
                                v-model="credentials" required
                                :label="$t('login.give_name')"
                                :hint="$t('login.hint')"
                                prepend-icon="person">
                  </v-text-field>
               </v-flex>
               <v-flex xs12 v-else>
                  <v-text-field color="primary"
                                v-model="credentials" required
                                :label="$t('login.give_password')"
                                :append-icon="show ? 'visibility_off' : 'visibility'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show">
                  </v-text-field>
               </v-flex>
               <v-flex xs12 mt-5>
                  <v-btn outline large fab @click="sendCredentials">
                     <v-icon>play_arrow</v-icon>
                  </v-btn>
               </v-flex>
               <v-flex v-if="secure" xs12 mt-5>
                  <v-btn flat @click="resetPassword">{{ $t('login.reset_password') }}</v-btn>
               </v-flex>
            </v-layout>
         </form>
      </v-flex>
   </v-layout>
</template>

<script>
   import DataStore from '../../core/dataStore';

   export default {
      name: 'loginBox',
      props: {
         type: {
            type: String,
            default: 'login'
         }
      },
      data() {
         return {
            credentials: '',
            show: false,
            sharedData: DataStore.state
         };
      },
      computed: {
         secure() {
            return this.type == 'password' || this.type == 'pass';
         }
      },
      methods: {
         sendCredentials() {
            this.$emit('login', this.credentials);
         },
         resetPassword() {
            if (this.sharedData.reportNumber == '')
               this.sharedData.settingsPassword = '';
            else {
               var title = this.$i18n.t('login.new_password');
               var time = new Date().toLocaleTimeString();
               var newPassword = 'dupa';
               var message = `${title}\n${this.sharedData.currentUser}\n${time}\n${newPassword}`;

               this.$device.sendSms
                  (this.sharedData.reportNumber, message, this.onMessageSent, this.basicErrorHandler);

               localStorage.settingsPassword = newPassword;
               this.sharedData.settingsPassword = newPassword;
            }
         }
      }
   }
</script>