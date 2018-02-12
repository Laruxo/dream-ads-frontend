<template>
    <li class="ad">
      <h3 class="ad__title title is-4">
        <a :href="item.link" target="_blank">{{ item.title }}</a>
      </h3>
      <span class="ad__price is-bold">{{ item.price }} &euro;</span>
      <span class="ad__location" v-if="item.location">{{ item.location }}</span>
      <span class="ad__date" v-if="item.date">{{ item.date }}</span>
      <div class="ad__tags tags is-marginless">
        <span class="ad__tags-item tag is-primary" v-if="item.year">{{ item.year }}</span>
        <span class="ad__tags-item tag is-primary" v-if="item.power">{{ item.power }} kW</span>
        <span class="ad__tags-item tag is-primary" v-if="item.cubic">{{ item.cubic }} ccm</span>
        <span class="ad__tags-item tag is-primary" v-if="item.mileage">{{ item.mileage }} km</span>
        <span class="ad__tags-item tag is-primary" v-if="item.color">{{ item.color }}</span>
      </div>
      <slider class="ad__pictures" v-if="item.pictures.length" :auto="false" height="inherit">
        <slider-item v-for="(img, i) in item.pictures" :key="i">
          <img :src="img">
        </slider-item>
      </slider>
      <p class="ad__info">{{ item.description }}</p>
      <a class="ad__remove is-size-1" @click="$emit('remove')">&times;</a>
    </li>
</template>

<script>
  import { Slider, SliderItem } from 'vue-easy-slider';

  export default {
    name: 'ad',
    components: {
      Slider,
      SliderItem
    },
    props: [
      'item',
    ],
  };
</script>

<style lang="scss" scoped>
  @import '../sass/variables';

  .ad {
    display: grid;
    grid-template-columns: 6fr 2fr 2fr;
    grid-template-rows: 2rem 1.5rem 1.5rem 13rem 4rem;
    grid-template-areas:
      "title title price"
      "tags tags tags"
      "location date date"
      "pictures pictures pictures"
      "info info remove";
    grid-row-gap: $base-margin/2;
    overflow: hidden;

    &__title {
      grid-area: title;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__price {
      grid-area: price;
      text-align: right;
      font-size: 1.5rem;
    }

    &__location {
      grid-area: location;
    }

    &__date {
      grid-area: date;
    }

    &__tags {
      grid-area: tags;
    }

    &__pictures {
      grid-area: pictures;
      overflow: hidden;
      height: 100%;
      text-align: center;

      img {
        width: auto;
        max-width: 100%;
        height: 100%;
      }
    }

    &__info {
      grid-area: info;
      overflow-y: auto;
      margin: 0;
    }

    &__remove {
      grid-area: remove;
      justify-self: center;
      align-self: center;
    }
  }
</style>
