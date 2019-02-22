<template>
   <v-layout align-center justify-center row fill-height>
      <v-flex xs12>
         <form @submit.prevent="sendCredentials">
            <v-layout align-center justify-center column fill-height>
               <v-flex xs12>
                  <v-text-field v-if="!secure"
                                color="primary"
                                v-model="credentials" required
                                :label="$t('login.give_name')"
                                :hint="$t('login.hint')"
                                prepend-icon="person">
                  </v-text-field>
                  <v-text-field v-else
                                color="primary"
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
            </v-layout>
         </form>
      </v-flex>
   </v-layout>
</template>

<script>
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
            show: false
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
         }
      }
   }
</script>