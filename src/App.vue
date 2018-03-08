<template>
  <main id="app">
    <header class="navbar is-dark has-shadow" id="top">
      <div class="navbar-brand">
        <h1 class="navbar-item">Dream Ads</h1>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <router-link class="navbar-item" :to="{name:'home'}">Home</router-link>
          <router-link class="navbar-item" :to="{name:'upload'}">Upload</router-link>
        </div>
      </div>
    </header>
    <router-view/>
  </main>
</template>

<script>
  import Ads from './components/Ads.vue';

  export default {
    name: 'app',
    components: {
      Ads
    },
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  @import './sass/variables';
  @import "~bulma";
</style>
