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
      sendSmsReport(titleStringName, optionalContent) {
         if (this.reportNumber.length == 0) {
            this.setError(this.$i18n.t('common.report_number_error'));
            return;
         }

         var title = this.$i18n.t(titleStringName);
         var time = new Date().toLocaleTimeString();
         var separator = "\n";
         if (optionalContent == void 0) {
            optionalContent = '';
            separator = '';
         }

         var message = `${title}\n${this.currentUser}\n${time}${separator}${optionalContent}`;
         this.$device.sendSms(this.reportNumber, message, this.onMessageSent, this.setError);
      }
   }
};
export default SMSMixin;