<template>
   <v-layout row wrap>
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

   export default {
      name: 'settings',
      data() {
         return {
            reportNumber: '',
            sharedData: DataStore.state
         }
      },
      methods: {
         saveSettings() {
            this.sharedData.reportNumber = this.reportNumber;
            localStorage.reportNumber = this.reportNumber;
         }
      },
      created() {
         this.reportNumber = this.sharedData.reportNumber;
      }
   }
</script>