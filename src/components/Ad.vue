<template>
  <li class="ad">
    <div class="ad__pictures" v-if="item.images">
      <img v-lazy="item.images"/>
    </div>
    <!--<swiper class="ad__pictures" v-if="item.pictures.length" :options="swiperOptions">-->
    <!--<swiper-slide v-for="(img, i) in item.pictures" :key="i">-->
    <!--<img :src="img">-->
    <!--</swiper-slide>-->
    <!--<div class="swiper-button-prev" slot="button-prev"></div>-->
    <!--<div class="swiper-button-next" slot="button-next"></div>-->
    <!--<div class="swiper-scrollbar" slot="scrollbar"></div>-->
    <!--</swiper>-->
    <div class="ad__overlay ad__overlay--top"/>
    <div class="ad__overlay ad__overlay--bottom"/>

    <h4 class="ad__title is-size-4">
      <a class="ad__ignore is-size-1 has-text-danger" @click="$emit('ignore')">&times;</a>
      <a :href="item.link" target="_blank">{{ item.title }}</a>
    </h4>
    <h3 class="ad__price is-size-3">{{ item.price }} &euro;</h3>
    <span class="ad__location" v-if="item.location">{{ item.location }}</span>
    <span class="ad__date" v-if="item.created_at">{{ item.created_at }}</span>
    <div class="ad__tags tags is-marginless">
      <span class="ad__tags-item tag is-primary" v-if="item.year">{{ item.year }}</span>
      <span class="ad__tags-item tag is-primary" v-if="item.power">{{ item.power }} kW</span>
      <span class="ad__tags-item tag is-primary" v-if="item.cubic">{{ item.cubic }} ccm</span>
      <span class="ad__tags-item tag is-primary" v-if="item.mileage">{{ item.mileage }} km</span>
      <span class="ad__tags-item tag is-primary" v-if="item.color">{{ item.color }}</span>
    </div>
    <p class="ad__info">{{ item.description }}</p>
  </li>
</template>

<script>
// import {swiper, swiperSlide} from 'vue-awesome-swiper';

export default {
  /**
   * components: {
   *   swiper,
   *   swiperSlide,
   * },
   */
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
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
          hide: true,
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
    padding: 5px 15px;
    display: grid;
    grid-template-columns: 5fr 3fr;
    grid-template-rows: 2fr 1fr 10fr 1fr 3fr;
    height: 380px;
    grid-template-areas: "title price" "tags tags" "empty empty" "location date" "info info";
    overflow: hidden;
    border-radius: $radius;
    transition: all .5s, background-color .2s;
    transition-timing-function: ease-in;
    position: relative;
    color: $text-invert;

    span {
      font-weight: 700;
    }

    a {
      color: $link-invert
    }

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

    &__pictures {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: -100;

      img {
        height: auto;
        max-height: 100%;
      }
    }

    &__overlay {
      background-color: transparentize($grey-dark, .25);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: -10;
      height: 5.5rem;
      &--top {
        bottom: auto;
      }
      &--bottom {
        top: auto;
        height: 6rem;
      }
    }

    &__ignore {
      padding-right: 25px;
      line-height: 1;
    }

    &__title {
      grid-area: title;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
    }

    &__price {
      grid-area: price;
      text-align: right;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
      flex-wrap: nowrap;
    }

    &__info {
      grid-area: info;
      overflow-y: auto;
      margin: 0;
    }
  }
</style>
