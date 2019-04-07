import { mapState, mapMutations } from 'vuex';

var ToastMixin = {
   data() {
      return {
         toast: false,
         toastTimeout: 4000,
         toastTimeoutHandler: null,
         errorToast: false,
         errorToastTimeout: 8000,
         errorTimeoutHandler: null
      };
   },
   computed: mapState({
      feedback: state => state.messages.feedback,
      error: state => state.messages.error
   }),
   watch: {
      feedback(newFeedback) {
         if (newFeedback != '') {
            this.toast = true;
            this.toastTimeoutHandler = setTimeout
               (() => this.setFeedback(''), this.toastTimeout);
         }
      },
      error(newError) {
         console.log(`new error: ${newError}`);
         if (newError != '') {
            this.errorToast = true;
            this.errorTimeoutHandler = setTimeout
               (() => this.clearError(), this.errorToastTimeout);
         }
      }
   },
   methods: {
      ...mapMutations({
         setFeedback: 'messages/setFeedback',
         setError: 'messages/setError',
         clearError: 'messages/clearError'
      }),
      clearToast() {
         clearTimeout(this.toastTimeoutHandler);
         this.toast = false;
         this.setFeedback('');
      },
      clearErrorToast() {
         clearTimeout(this.errorTimeoutHandler);
         this.errorToast = false;
         this.clearError();
      }
   }
};
export default ToastMixin;