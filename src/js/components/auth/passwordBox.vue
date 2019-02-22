<template>
   <v-layout align-center justify-center row fill-height>
      <v-flex xs12>
         <form @submit.prevent="savePassword">
            <v-layout align-center justify-center column fill-height>
               <v-flex xs12>
                  <v-text-field color="primary"
                                v-model="pass1" required
                                :label="$t('login.give_password')"
                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                :type="show1 ? 'text' : 'password'"
                                @click:append="show1 = !show1">
                  </v-text-field>
                  <v-text-field color="primary"
                                v-model="pass2" required
                                :label="$t('login.retype_password')"
                                :append-icon="show2 ? 'visibility_off' : 'visibility'"
                                :type="show2 ? 'text' : 'password'"
                                @click:append="show2 = !show2"
                                :rules="[matchingPasswords]">
                  </v-text-field>
               </v-flex>
               <v-flex xs12 mt-5>
                  <v-btn outline large fab @click="savePassword">
                     <v-icon>play_arrow</v-icon>
                  </v-btn>
               </v-flex>
            </v-layout>
         </form>
      </v-flex>
   </v-layout>
</template>

<script>
   import DataStore from '../../core/dataStore';

   export default {
      name: 'setPassword',
      data() {
         return {
            pass1: '',
            pass2: '',
            show1: false,
            show2: false,
            matchingPasswords: v => v == this.pass1 || this.$i18n.t('login.wrong_password'),
            sharedData: DataStore.state
         };
      },
      methods: {
         savePassword() {
            if (this.pass1 == this.pass2) {
               localStorage.settingsPassword = this.pass1;
               this.sharedData.settingsPassword = this.pass1;
            }
         }
      }
   }
</script>