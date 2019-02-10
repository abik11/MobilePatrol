<template>
   <v-layout align-center justify-center row fill-height>
      <v-flex xs12>
         <form @submit.prevent="sendName">
            <v-layout align-center justify-center column fill-height>
               <v-flex xs12>
                  <v-text-field color="primary"
                                v-model="userName" required
                                :label="$t('login.give_name')"
                                :hint="$t('login.hint')"
                                prepend-icon="person">
                  </v-text-field>
               </v-flex>
               <v-flex xs12 mt-5>
                  <v-btn outline large fab @click="sendName">
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
      methods: {
         sendName() {
            this.$emit('login', this.userName);
         }
      }
   }
</script>