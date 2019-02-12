<template>
   <div class="side-menu-wrapper">
      <v-card flat tile color="secondary" class="full">
         <v-layout>
            <v-flex xs12>
               <v-list class="grey darken-4 grey--text text--lighten-4">

                  <!-- issue / panic / instructions -->
                  <v-list-tile class="grey darken-4">
                     <v-list-tile-content class="grey darken-4">
                        <v-list-tile-title v-html="$t('side_menu.panic')"></v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>

                  <v-list-tile class="grey darken-4">
                     <v-list-tile-content class="grey darken-4">
                        <v-list-tile-title v-html="$t('side_menu.raport_issue')"></v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>

                  <v-list-tile class="grey darken-4">
                     <v-list-tile-content class="grey darken-4">
                        <v-list-tile-title v-html="$t('side_menu.read_instructions')"></v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>

                  <v-list-tile class="grey darken-4">
                     <v-list-tile-content class="grey darken-4">
                        <v-list-tile-title v-html="$t('side_menu.logout')"></v-list-tile-title>
                     </v-list-tile-content>
                  </v-list-tile>

               </v-list>
            </v-flex>
         </v-layout>
      </v-card>
   </div>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorMixin from '../core/errorMixin';

   export default {
      name: 'sideMenu',
      mixins: [ErrorMixin],
      data: function () {
         return {
            error: '',
            sharedData: DataStore.state
         }
      }
   }
</script>

<style lang="scss" scoped>
   .side-menu-wrapper {
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 100;
      height: 100%;
      width: 60%;
   }
</style>