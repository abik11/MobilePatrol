<template>
   <v-layout row wrap>
      <v-snackbar v-model="toast" right top :timeout="toastTimeout">
         {{ $t('common.saved') }}
         <v-btn color="primary" flat @click="toast = false">{{ $t('common.close') }}</v-btn>
      </v-snackbar>
      <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
         {{ error }}
         <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
      </v-snackbar>

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
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorToastMixin from '../core/errorToastMixin';

   export default {
      name: 'settings',
      data() {
         return {
            toast: false,
            toastTimeout: 2000,
            reportNumber: '',
            sharedData: DataStore.state
         }
      },
      methods: {
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