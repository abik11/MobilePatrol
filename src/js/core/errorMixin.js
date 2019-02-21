var ErrorMixin = {
   data() {
      return {
         error: ''
      };
   },
   methods: {
      basicErrorHandler(error) {
         if (this.loading !== 'undefined')
            this.loading = false;
         if (typeof (error) == 'string')
            this.error = error;
         if (typeof (error) == 'object')
            if (typeof (error.message) !== 'undefined')
               this.error = error.message;

         console.error(error);
      }
   }
};
export default ErrorMixin;