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
    }
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  @import './sass/variables';

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.15;
    margin: 0;
    color: $primary-text-color;
  }

  a {
    color: $brand-color;
    text-decoration: none;

    &:hover {
      opacity: .7;
    }
  }

  .slider {
    .indicators {
      bottom: 0;
    }

    .btn {
      background: none;

      &:hover {
        .slider-icon {
          border-color: lighten($brand-color, 10%);
        }
      }
    }

    .slider-icon {
      border-color: $brand-color;
    }
  }
</style>
