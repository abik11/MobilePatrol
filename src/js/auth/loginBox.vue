<template>
   <v-layout align-center justify-center row fill-height>
      <v-flex xs12>
         <form @submit.prevent="sendCredentials">
            <v-layout align-center justify-center column fill-height>
               <v-flex xs12 mb-5 v-if="!secure">
                  <img src="../../img/logo.png" />
               </v-flex>
               <v-flex xs12 v-if="!secure">
                  <v-text-field color="primary"
                                v-model="login" required
                                :label="$t('login.give_name')"
                                :hint="$t('login.hint')"
                                prepend-icon="person">
                  </v-text-field>
               </v-flex>
               <v-flex xs12 v-else>
                  <v-text-field color="primary"
                                v-model="pass" required
                                :label="$t('login.give_password')"
                                :append-icon="show ? 'visibility_off' : 'visibility'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show">
                  </v-text-field>
               </v-flex>
               <v-flex xs12 mt-5>
                  <v-btn outline large fab color="error" @click="sendCredentials">
                     <v-icon>play_arrow</v-icon>
                  </v-btn>
               </v-flex>
               <v-flex v-if="secure" xs12 mt-5>
                  <v-btn flat color="error" @click="resetPassword">{{ $t('login.reset_password') }}</v-btn>
               </v-flex>
            </v-layout>
         </form>
      </v-flex>
   </v-layout>
</template>

<script>
   import sha256 from './sha256';
   import { mapState, mapMutations, mapActions } from 'vuex';

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
            login: '',
            pass: '',
            show: false,
            defaultPasswordLength: 5
         };
      },
      computed: {
         ...mapState([
            'currentUser',
            'reportNumber'
         ]),
         secure() {
            return this.type == 'password' || this.type == 'pass';
         },
         credentials() {
            return this.secure ? sha256(this.pass) : this.login;
         }
      },
      methods: {
         ...mapMutations({
            setSettingsPassword: 'setSettingsPassword',
            setError: 'messages/setError'
         }),
         ...mapActions(['setSettingsPassword']),
         sendCredentials() {
            this.$emit('login', this.credentials);
         },
         resetPassword() {
            if (this.reportNumber == '')
               this.setSettingsPassword('');
            else {
               var title = this.$i18n.t('login.new_password');
               var time = new Date().toLocaleTimeString();
               var newPassword = this.generateRandomPassword(this.defaultPasswordLength);
               var message = `${title}\n${this.currentUser}\n${time}\n${newPassword}`;

               this.$device.sendSms
                  (this.reportNumber, message, this.onMessageSent, this.setError);

               this.setSettingsPassword(sha256(newPassword));
            }
         },
         generateRandomPassword(passwordLength) {
            var text = "";
            var chars = "abcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < passwordLength; i++)
               text += chars.charAt(Math.floor(Math.random() * chars.length));

            return text;
         }
      }
   }
</script>