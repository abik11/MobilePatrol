﻿var SMSMixin = {
   methods: {
      sendSmsReport(titleStringName, optionalContent) {
         if (this.sharedData.reportNumber.length == 0) {
            this.error = this.$i18n.t('common.report_number_error');
            return;
         }

         var title = this.$i18n.t(titleStringName);
         var time = new Date().toLocaleTimeString();
         var separator = "\n";
         if (optionalContent == void 0) {
            optionalContent = '';
            separator = '';
         }

         var message = `${title}\n${this.sharedData.currentUser}\n${time}${separator}${optionalContent}`;

         this.$device.sendSms
            (this.sharedData.reportNumber, message, this.onMessageSent, this.basicErrorHandler);
      }
   }
};
export default SMSMixin;