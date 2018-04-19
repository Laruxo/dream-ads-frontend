<template>
  <div id="app">
    <ads/>
  </div>
</template>

<script>
import Ads from './components/Ads.vue';

export default {
  components: {
    Ads,
  },
  created() {
    this.$store.dispatch('init');
  },
};
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin-ext');
  @import './sass/variables';
  @import "~bulma";
</style>
