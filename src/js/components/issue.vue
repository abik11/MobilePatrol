<template>
   <div>
      <button @click="captureImage">{{$t('issue.make_picture')}}</button>
      <br />
      <div v-if="imageUri.length != 0">
         <img class="img" :src="imageUri" />
         <br />
         <button @click="sendImage">{{$t('common.send')}}</button>
      </div>
   </div>
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