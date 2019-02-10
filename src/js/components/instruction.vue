<template>
   <div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed ex efficitur, fringilla metus non, dapibus massa. Vivamus scelerisque, tortor et dignissim volutpat, dui erat blandit risus, ac facilisis quam lectus varius nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut molestie lacinia magna. Phasellus ut arcu sed enim cursus auctor sed congue neque. Nam tincidunt odio velit, ut ultrices tortor varius id. Nulla suscipit lacus eu sem fermentum, ut fermentum nulla dignissim. Quisque nisi dolor, malesuada eget faucibus in, fringilla nec magna. Sed tristique nulla non risus maximus, nec eleifend velit tempor. Aliquam ultricies nulla eu nibh efficitur elementum vel mattis nisi. Aenean faucibus euismod lacus non semper.</p>
      <img class="first-aid-pic" src="../../img/first-aid.jpg" />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed ex efficitur, fringilla metus non, dapibus massa. Vivamus scelerisque, tortor et dignissim volutpat, dui erat blandit risus, ac facilisis quam lectus varius nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut molestie lacinia magna. Phasellus ut arcu sed enim cursus auctor sed congue neque. Nam tincidunt odio velit, ut ultrices tortor varius id. Nulla suscipit lacus eu sem fermentum, ut fermentum nulla dignissim. Quisque nisi dolor, malesuada eget faucibus in, fringilla nec magna. Sed tristique nulla non risus maximus, nec eleifend velit tempor. Aliquam ultricies nulla eu nibh efficitur elementum vel mattis nisi. Aenean faucibus euismod lacus non semper.</p>
   </div>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorMixin from '../core/errorMixin';

   export default {
      name: 'instruction',
      mixins: [ErrorMixin],
      data: function () {
         return {
            error: '',
            sharedData: DataStore.state
         }
      }
   }
</script>

<style lang="scss" scoped>
   .first-aid-pic {
      max-width: 150px;
   }
</style>