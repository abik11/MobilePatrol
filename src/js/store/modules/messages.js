export default {
   namespaced: true,
   state: {
      error: '',
      feedback: ''
   },
   mutations: {
      clearError(state) {
         state.error = '';
      },
      setError(state, error) {
         console.error(error);

         if (typeof error == 'string')
            state.error = error;
         else if (typeof error == 'object' && typeof error.message !== 'undefined')
            state.error = error.message;
         else
            state.error = 'Error';
      },
      setFeedback(state, feedback) {
         state.feedback = feedback;
      }
   }
}