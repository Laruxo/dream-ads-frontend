<template>
  <section class="section">
    <stats :data="$store.state.filteredAds"/>
    <filters/>
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
        <button class="button is-primary" @click="sortBy('created_at')">
          Created {{ sortedBy === 'created_at' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
        </button>
      </div>
    </section>
    <section>
      <a class="button is-primary" download="ads.json" :href="$store.state.downloadUrl"
         v-if="$store.state.downloadUrl">
        Download
      </a>
      <button class="button is-primary" @click="$store.dispatch('saveAds')" v-else>
        Export
      </button>
      <button class="button is-danger" @click="$store.dispatch('removeAllAds')">
        Remove All
      </button>
    </section>
    <transition-group name="ad" tag="ul" class="ads">
      <li is="ad" v-for="item in sortedList" :key="item.id"
          :item="item" @ignore="$store.dispatch('ignoreAd', item.id)"/>
    </transition-group>
  </section>
</template>

<script>
import Uploader from './Uploader';
import Ad from './Ad';
import Stats from './Stats';
import Filters from './Filters';

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
    sortedList() {
      const order = this.isAscending ? -1 : 1;
      return this.$store.state.filteredAds.slice(0).sort((a, b) => {
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
