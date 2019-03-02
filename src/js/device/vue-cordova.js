var VueCordova = {};

VueCordova.install = function (Vue, options) {
   var imageMimeType = 'image/jpeg';
   var undefined = 'undefined';

   var defaults = {
      defaultErrorHandler(error) {
         console.error(error);
      },
      cameraConfig: {
         quality: 50,
         targetWidth: 800,
         targetHeight: 600,
         encoding: imageMimeType == 'image/jpeg' ? Camera.EncodingType.JPEG : Camera.EncodingType.PNG,
         correctOrientation: true,
         saveToPhotoAlbum: false,
         destinationType: Camera.DestinationType.FILE_URI
      },
      smsConfig: {
         replaceLineBreaks: false,
         android: { intent: '' }
      }
   };

   var device = {
      getSmsConfig() {
         return defaults.smsConfig;
      },

      sendSms(number, message, success, error, options) {
         if (typeof (error) === undefined)
            error = defaults.defaultErrorHandler;
         if (typeof (options) === undefined)
            options = defaults.smsConfig;
         sms.send(number, message, options, success, error);
      },

      sendMms(number, message, image, success, error, method) {
         if (typeof (error) === undefined)
            error = defaults.defaultErrorHandler;
         if (typeof (method) === undefined)
            method = '';

         var convertPhoneToArray = function (phone) {
            if (typeof phone === 'string' && phone.indexOf(',') !== -1) {
               phone = phone.split(',');
            }
            if (Object.prototype.toString.call(phone) !== '[object Array]') {
               phone = [phone];
            }
            return phone;
         }

         cordova.exec(
            success,
            error,
            'mms',
            'send',
            [convertPhoneToArray(number), message, image, method]
         );
      },

      getCameraConfig() {
         return defaults.cameraConfig;
      },

      getPicture(success, error, options) {
         if (typeof (error) === undefined)
            error = defaults.defaultErrorHandler;
         if (typeof (options) === undefined)
            options = defaults.cameraConfig;
         navigator.camera.getPicture(success, error, options);
      },

      readFile(fileName, onFileLoaded, onFileError) {
         window.resolveLocalFileSystemURL(fileName, function (fileEntry) {
            fileEntry.file(function (file) {
               var reader = new FileReader();
               reader.onloadend = onFileLoaded;
               reader.onerror = onFileError;
               reader.readAsBinaryString(file);
            }, onFileError);
         }, defaults.defaultErrorHandler);
      },

      imageMimeType: imageMimeType
   };

   Vue.prototype.$device = device;
};

export default VueCordova;