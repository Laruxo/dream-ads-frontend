<template>
  <li class="ad">
    <h4 class="ad__title title is-4">
      <a :href="item.link" target="_blank">{{ item.title }}</a>
    </h4>
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
    <div class="ad__pictures">
      <img :src="item.pictures[0]">
    </div>
    <!--<swiper class="ad__pictures" v-if="item.pictures.length" :options="swiperOptions">-->
      <!--<swiper-slide v-for="(img, i) in item.pictures" :key="i">-->
        <!--<img :src="img">-->
      <!--</swiper-slide>-->
      <!--<div class="swiper-button-prev" slot="button-prev"></div>-->
      <!--<div class="swiper-button-next" slot="button-next"></div>-->
      <!--<div class="swiper-scrollbar" slot="scrollbar"></div>-->
    <!--</swiper>-->
    <div class="ad__actions">
      <a class="is-size-1">+</a>
      <a class="is-size-1 has-text-danger" @click="$emit('remove')">&times;</a>
    </div>
    <p class="ad__info">{{ item.description }}</p>
  </li>
</template>

<script>
  import {swiper, swiperSlide} from 'vue-awesome-swiper';

  export default {
    name: 'ad',
    components: {
      swiper,
      swiperSlide,
    },
    props: [
      'item',
    ],
    data() {
      return {
        swiperOptions: {
          wrapperClass: 'swiper-wrapper',
          loop: true,
          lazy: true,
          mousewheel: {
            forceToAxis: true,
            invert: true,
          },
          scrollbar: {
            el: '.swiper-scrollbar',
            hide: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '../sass/variables';
  @import "~swiper/dist/css/swiper.css";

  .ad {
    display: grid;
    grid-template-columns: 4fr 3fr 1fr 1fr;
    grid-template-rows: 2rem 1.5rem 1.5rem 13rem 4rem;
    grid-template-areas:
        "title title price price"
        "tags tags tags tags"
        "location date date date"
        "pictures pictures pictures actions"
        "info info info info";
    grid-row-gap: $gap/2;
    overflow: hidden;
    padding: $gap/2;
    border-radius: $radius;
    transition: all .5s, background-color .2s;
    transition-timing-function: ease-in;

    &:hover {
      background-color: transparentize($grey, .8);
    }

    &-leave-active {
      position: absolute; // hack for moving other ads on remove
      grid-column: 1 / 1;
      transition: opacity .5s, transform 5s;
      transform: scale(.05);
    }

    &-enter,
    &-leave-to {
      opacity: 0;
      transform: scale(.5);
    }

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
      text-align: right;
    }

    &__tags {
      grid-area: tags;
    }

    &__pictures {
      grid-area: pictures;
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;

      img {
        width: 100%;
        height: auto;
      }
    }

    &__actions {
      grid-area: actions;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }

    &__info {
      grid-area: info;
      overflow-y: auto;
      margin: 0;
    }
  }
</style>
