import { mapState, mapMutations } from 'vuex';

var SMSMixin = {
   computed: mapState([
      'reportNumber',
      'currentUser'
   ]),
   methods: {
      ...mapMutations({
         setError: 'messages/setError'
      }),
      sendSmsReport(titleStringName, optionalContent, feedbackStringName) {
         if (this.reportNumber.length == 0) {
            this.setError(this.$i18n.t('common.report_number_error'));
            return;
         }

         var title = this.$i18n.t(titleStringName);
         var time = new Date().toLocaleTimeString();
         var separator = "\n";
         if (optionalContent == void 0 || optionalContent == '') {
            optionalContent = '';
            separator = '';
         }

         var message = `${title}\n${this.currentUser}\n${time}${separator}${optionalContent}`;
         this.$device.sendSms(this.reportNumber, message, this.onSmsSent(feedbackStringName), this.setError);
      },
      onSmsSent(feedbackStringName) {
         if (feedbackStringName == void 0 || feedbackStringName == '')
            this.setFeedback('');
         else
            this.setFeedback(this.$i18n.t(feedbackStringName));

         console.log("SMS has been sent");
      }
   }
};
export default SMSMixin;