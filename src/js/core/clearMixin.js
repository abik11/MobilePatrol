var ClearMixin = {
   methods: {
      clear() {
         console.log('Clearing...');
         Object.assign(this.$data, this.$options.data.call(this));
      }
   }
};
export default ClearMixin;