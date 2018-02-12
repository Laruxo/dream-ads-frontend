<template>
  <main id="app" class="section">
    <h1 class="title is-1 has-text-centered">Dream Ads</h1>
    <ads></ads>
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

  body {
    font-family: 'Roboto', sans-serif;
  }

  .slider {
    .indicators {
      bottom: 0;
    }

    .slider-icon {
      border-color: $brand-color;
    }

    .btn {
      background: none;

      &:hover {
        .slider-icon {
          border-color: lighten($brand-color, 10%);
        }
      }
    }
  }
</style>
