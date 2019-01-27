<template>
   <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn">
      <div>
         <p>instruction</p>
      </div>
   </transition>
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