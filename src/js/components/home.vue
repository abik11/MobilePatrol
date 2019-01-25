<template>
   <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn">
      <div>
         <p>{{$t('common.hello_world')}}</p>
      </div>
   </transition>
</template>

<script>
   import DataStore from '../core/dataStore';
   import ErrorMixin from '../core/errorMixin';
   import ClearMixin from '../core/clearMixin';

   export default {
      name: 'home',
      mixins: [ErrorMixin, ClearMixin],
      data: function () {
         return {
            sharedData: DataStore.state
         }
      }
   }
</script>