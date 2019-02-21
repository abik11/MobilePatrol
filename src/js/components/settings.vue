<template>
   <v-layout row>
      <v-flex xs12 pa-2>
         <p>Hello world</p>
      </v-flex>
   </v-layout>
</template>

<script>
   import DataStore from '../core/dataStore';
   
   export default {
      name: 'settings',
      data() {
         return {
            sharedData: DataStore.state
         }
      }
   }
</script>