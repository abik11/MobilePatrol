﻿<template>
   <transition name="fade" mode="out-in">
      <v-layout row wrap>
         <v-flex xs6 text-xs-left>
            <v-btn outline color="primary" @click="captureImage">
               <v-icon>photo_camera</v-icon>
               {{$t('issue.make_picture')}}
            </v-btn>
         </v-flex>
         <v-flex xs6 text-xs-right>
            <v-btn outline color="primary" @click="sendImage" v-if="imageCaptured">
               <v-icon>send</v-icon>
               {{$t('common.send')}}
            </v-btn>
         </v-flex>
         <v-flex xs12 text-xs-center v-if="imageCaptured">
            <img class="img" :src="imageUri" />
         </v-flex>
         <v-flex xs12 text-xs-center v-if="imageCaptured">
            <v-textarea outline
                        auto-grow
                        :label="$t('issue.describe_issue')"
                        v-model="description">
            </v-textarea>
         </v-flex>
      </v-layout>
   </transition>
</template>

<script>
   import { mapState, mapMutations } from 'vuex';

   export default {
      name: 'issue',
      props: ['name'],
      data: function () {
         return {
            imageUri: '',
            description: '',
            imgPrefix: 'data:image/jpeg;base64,'
         }
      },
      computed: {
         ...mapState([
            'reportNumber',
            'currentUser'
         ]),
         imageCaptured() {
            return this.imageUri.length != 0;
         }
      },
      methods: {
         ...mapMutations({
            setError: 'messages/setError'
         }),
         captureImage() {
            this.$device.getPicture(imageUri => this.imageUri = imageUri);
         },
         getImageAsBase64() {
            return new Promise((resolve, reject) => {
               this.$device.readFile
                  (this.imageUri, e => resolve(btoa(e.target.result)), () => reject());
            });
         },
         sendImage() {
            if (this.reportNumber.length == 0) {
               this.setError(this.$i18n.t('common.report_number_error'));
               return;
            }

            const time = new Date().toLocaleTimeString();
            const title = this.$i18n.t("issue.issue_raport");

            if (this.description.length == 0)
               var message = `${title}\n${this.name}\n${this.currentUser}\n${time}`;
            else
               var message = `${title}\n${this.name}\n${this.currentUser}\n${this.description}\n${time}`;

            this.getImageAsBase64()
               .then(imgBase64 => {
                  this.$device.sendMms(
                     this.reportNumber,
                     message,
                     `${this.imgPrefix}${imgBase64}`,
                     this.onPictureSent,
                     this.setError,
                     'INTENT'
                  );
               });
         },
         onPictureSent() {
            console.log("MMS has been sent");
         }
      }
   }
</script>

<style lang="scss" scoped>
   .img {
      max-width: 400px;
      max-height: 400px;
   }
</style>