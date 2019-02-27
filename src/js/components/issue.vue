<template>
   <transition name="fade" mode="out-in">
      <v-layout row wrap>
         <v-snackbar v-model="errorToast" color="error" right top :timeout="errorToastTimeout">
            {{ error }}
            <v-btn color="secondary" flat @click="clearError">{{ $t('common.close') }}</v-btn>
         </v-snackbar>

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
         <v-flex xs12 text-xs-center>
            <img class="img" :src="imageUri" />
         </v-flex>
      </v-layout>
   </transition>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorToastMixin from '../core/errorToastMixin';

   export default {
      name: 'issue',
      mixins: [ErrorToastMixin],
      data: function () {
         return {
            imageUri: '',
            imgPrefix: 'data:image/jpeg;base64,',
            sharedData: DataStore.state
         }
      },
      computed: {
         imageCaptured() {
            return this.imageUri.length != 0;
         }
      },
      methods: {
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
            if (this.sharedData.reportNumber.length == 0) {
               this.error = this.$i18n.t('common.report_number_error');
               return;
            }

            var time = new Date().toLocaleTimeString();
            var title = this.$i18n.t("issue.issue_raport");
            var message = `${title}\n${this.sharedData.currentUser}\n${time}`;

            this.getImageAsBase64()
               .then(imgBase64 => {
                  this.$device.sendMms(
                     this.sharedData.reportNumber,
                     message,
                     `${this.imgPrefix}${imgBase64}`,
                     this.onPictureSent,
                     this.basicErrorHandler,
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