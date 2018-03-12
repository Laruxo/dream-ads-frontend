<template>
  <section class="section">
    <stats :data="filteredAds"/>
    <filters :data="$store.state.ads" @filter-change="filter"/>
    <section class="ads__sorting">
      <div class="buttons has-addons">
        <button class="button is-white is-static">Sort By</button>
        <button class="button is-primary" @click="sortBy('price')">
          Price {{ sortedBy === 'price' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
        </button>
        <button class="button is-primary" @click="sortBy('year')">
          Year {{ sortedBy === 'year' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
        </button>
        <button class="button is-primary" @click="sortBy('mileage')">
          Mileage {{ sortedBy === 'mileage' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
        </button>
        <button class="button is-primary" @click="sortBy('date')">
          Updated {{ sortedBy === 'date' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
        </button>
      </div>
    </section>
    <section>
      <button class="button is-danger" @click="$store.dispatch('removeAllAds')">
        Remove All
      </button>
    </section>
    <transition-group name="ad" tag="ul" class="ads">
      <li is="ad" v-for="item in sortedList" :key="item.id"
          :item="item" @remove="$store.dispatch('removeAd', item.id)"/>
    </transition-group>
  </section>
</template>

<script>
import Uploader from './Uploader';
import Ad from './Ad';
import Stats from './Stats';
import Filters from './Filters';
import {mapGetters} from 'vuex';

export default {
  components: {
    Filters,
    Stats,
    Uploader,
    Ad,
  },
  data() {
    return {
      isAscending: true,
      sortedBy: 'price',
    };
  },
  computed: {
    ...mapGetters([
      'filteredAds',
    ]),
    sortedList() {
      const order = this.isAscending ? -1 : 1;
      return this.filteredAds.slice(0).sort((a, b) => {
        if (a[this.sortedBy] < b[this.sortedBy]) {
          return order;
        }

        if (a[this.sortedBy] > b[this.sortedBy]) {
          return -1 * order;
        }

        return a.price - b.price || a.id.localeCompare(b.id);
      });
    },
  },
  methods: {
    filter(data) {
      this.$store.dispatch('setFilters', data);
    },
    sortBy(field) {
      this.sortedBy = field;
      this.isAscending = !this.isAscending;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../sass/variables';

  section > section {
    margin: $gap/2 0;
  }

  .ads {
    display: grid;
    grid: auto / repeat(3, 1fr);
    grid-gap: $gap;
    position: relative;
  }
</style>
