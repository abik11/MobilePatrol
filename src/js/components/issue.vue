<template>
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
      <v-flex xs12 text-xs-center>
         <img class="img" :src="imageUri" />
      </v-flex>
   </v-layout>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorMixin from '../core/errorMixin';

   export default {
      name: 'issue',
      mixins: [ErrorMixin],
      data: function () {
         return {
            imageUri: '',
            error: '',
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
            var now = new Date();
            var time = now.toLocaleTimeString();
            var message = this.$i18n.t("issue.issue_raport");
            message = `${message}\n${this.sharedData.currentUser}\n${time}`;

            this.getImageAsBase64()
               .then(imgBase64 => {
                  this.$device.sendMms(
                     this.sharedData.reportNumber,
                     message,
                     `data:image/jpeg;base64,${imgBase64}`,
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