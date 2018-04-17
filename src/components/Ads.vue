<template>
  <section class="section">
    <stats :data="$store.getters.filteredAds"/>
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
      <button class="button is-primary" @click="fetchAds" v-if="!loading">
        Fetch New Ads
      </button>
      <button class="button is-primary" disabled v-else>
        Fetching...
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
import Ad from './Ad';
import Stats from './Stats';
import Filters from './Filters';

export default {
  components: {
    Filters,
    Stats,
    Ad,
  },
  data() {
    return {
      isAscending: true,
      sortedBy: 'price',
      loading: false,
    };
  },
  computed: {
    sortedList() {
      const order = this.isAscending ? -1 : 1;
      return this.$store.getters.filteredAds.slice(0).sort((a, b) => {
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
    async fetchAds() {
      try {
        this.loading = true;
        await this.$store.dispatch('updateAds');
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
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
