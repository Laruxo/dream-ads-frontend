<template>
  <main class="hero is-primary is-fullheight">
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <h1 class="navbar-item title is-1">Dream Ads</h1>
          </div>
        </div>
      </header>
    </div>
    <div class="hero-body">
      <section class="has-text-centered" v-if="!filteredAds.length">
        <h2 class="title">Nothign yet</h2>
        <h3 class="subtitle">Try running scraper</h3>
      </section>

      <section>
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <button class="button is-large is-success is-fullwidth" @click="fetchAds" v-if="!loading">
              Fetch New Ads
            </button>
            <button class="button is-large is-loading is-fullwidth" disabled v-else>
              Fetching...
            </button>
          </div>
          <div class="tile is-parent" v-if="filteredAds.length">
            <button class="button is-large is-danger is-fullwidth" @click="removeAllAds()">
              Remove All
            </button>
          </div>
        </div>
      </section>

      <template v-if="filteredAds.length">
        <stats :data="filteredAds"/>
        <filters/>
        <section class="ads__sorting">

          <div class="tile is-ancestor">
            <div class="tile is-parent">
              <button class="button is-medium is-fullwidth" @click="sortBy('price')">
                Price {{ sortedBy === 'price' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
              </button>
            </div>
            <div class="tile is-parent">
              <button class="button is-medium is-fullwidth" @click="sortBy('year')">
                Year {{ sortedBy === 'year' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
              </button>
            </div>
            <div class="tile is-parent">
              <button class="button is-medium is-fullwidth" @click="sortBy('mileage')">
                Mileage {{ sortedBy === 'mileage' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
              </button>
            </div>
            <div class="tile is-parent">
              <button class="button is-medium is-fullwidth" @click="sortBy('created_at')">
                Created {{ sortedBy === 'created_at' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
              </button>
            </div>
          </div>
        </section>
        <section>
          <transition-group name="ad" tag="ul" class="ads">
            <li is="ad" v-for="item in sortedList" :key="item.id"
                :item="item" @ignore="ignoreAd(item.id)"/>
          </transition-group>
        </section>
      </template>
    </div>
    <div class="hero-foot"/>
  </main>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
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
    ...mapActions([
      'removeAllAds',
      'ignoreAd',
      'updateAds',
    ]),
    sortBy(field) {
      this.sortedBy = field;
      this.isAscending = !this.isAscending;
    },
    async fetchAds() {
      try {
        this.loading = true;
        await this.updateAds();
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

  .navbar > .container {
    justify-content: center;
  }

  .hero-body {
    flex-flow: column;
    padding-top: 0;
    padding-bottom: 0;

    > section {
      width: 100%;
      margin: 12px 0;
    }
  }

  .ads {
    display: grid;
    grid: auto / repeat(3, 1fr);
    grid-gap: $gap/2;
    position: relative;
  }
</style>
