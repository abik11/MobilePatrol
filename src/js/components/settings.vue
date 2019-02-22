<template>
   <v-layout row>

      <v-snackbar v-model="toast" right top :timeout="toastTimeout">
         {{ $t('common.saved') }}
         <v-btn color="primary" flat @click="toast = false">{{ $t('common.close') }}</v-btn>
      </v-snackbar>
      <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
         {{ error }}
         <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
      </v-snackbar>

      <password-box v-if="!passwordSet" class="login-box full" />
      <login-box v-else-if="!authorized" class="login-box full" type="pass" @login="onUserAuthorize" />
      <v-layout v-else row wrap>
         <v-flex xs12 text-xs-left>
            <v-text-field box color="primary"
                          v-model="reportNumber"
                          :label="$t('settings.phone')"
                          prepend-inner-icon="phone">
            </v-text-field>
         </v-flex>

         <v-footer absolute height="auto">
            <v-layout align-center justify-end fill-height>
               <v-flex xs3>
                  <v-btn color="primary" fab dark @click="saveSettings">
                     <v-icon>save</v-icon>
                  </v-btn>
               </v-flex>
            </v-layout>
         </v-footer>
      </v-layout>

   </v-layout>
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
            reportNumber: '',
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
         saveSettings() {
            this.sharedData.reportNumber = this.reportNumber;
            localStorage.reportNumber = this.reportNumber;
            this.toast = true;
         }
      },
      created() {
         this.reportNumber = this.sharedData.reportNumber;
      }
   }
</script>