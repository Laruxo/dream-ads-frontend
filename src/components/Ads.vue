<template>
  <section class="section">
    <uploader @uploaded="handleUpload"></uploader>
    <div class="ads__stats">
      <scatter-chart class="ads__stats--chart" :chart-data="chartData"></scatter-chart>
      <div>
        <div>Min {{ minPrice }}&euro;</div>
        <div>Max {{ maxPrice }}&euro;</div>
        <div>Avg {{ averagePrice }}&euro;</div>
      </div>
    </div>
    <div class="ads__sorting">
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
      </div>
    </div>
    <div class="ads__filters">
      <div class="select">
        <select v-model="yearFrom">
          <option disabled value="">Year From</option>
          <option v-for="year in years" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="select">
        <select v-model="yearTo">
          <option disabled value="">Year To</option>
          <option v-for="year in years" :value="year">{{ year }}</option>
        </select>
      </div>
      <button class="button" :class="{ 'is-primary': withMileage }"
              @click="withMileage = !withMileage">Only with mileage</button>
      <button class="button is-danger" @click="removeAll">Remove All</button>
    </div>
    <ul class="ads">
      <li is="ad" v-for="(item, index) in sortedList" :key="index"
          :item="item" @remove="removeItem(index)"></li>
    </ul>
  </section>
</template>

<script>
  import Uploader from './Uploader';
  import ScatterChart from './ScatterChart';
  import Ad from './Ad';

  export default {
    name: 'ads',
    components: {Uploader, Ad, ScatterChart},
    data() {
      return {
        items: [],
        isAscending: true,
        sortedBy: 'price',
        yearFrom: '',
        yearTo: '',
        withMileage: false,
      };
    },
    mounted() {
      try {
        const items = localStorage.getItem('ads');
        if (items && items.length) {
          this.items = JSON.parse(items);
          this.yearFrom = this.minYear;
          this.yearTo = this.maxYear;
        }
      } catch (e) {
        console.error('Error parsing local data.', e);
      }
    },
    computed: {
      filteredList() {
        let items = this.items.slice(0);

        if (this.yearFrom) {
          items = items.filter(item => item.year >= this.yearFrom);
        }

        if (this.yearTo) {
          items = items.filter(item => item.year <= this.yearTo);
        }

        if (this.withMileage) {
          items = items.filter(item => item.mileage > 0);
        }

        return items;
      },
      sortedList() {
        const order = this.isAscending ? -1 : 1;
        return this.filteredList.sort((a, b) => {
          if (a[this.sortedBy] < b[this.sortedBy]) {
            return order;
          }

          if (a[this.sortedBy] > b[this.sortedBy]) {
            return -1 * order;
          }

          return 0;
        });
      },
      years() {
        return Array.from(
          new Set(
            this.items.map(item => item.year)
          )
        ).sort();
      },
      minYear() {
        return Math.min(...this.years);
      },
      maxYear() {
        return Math.max(...this.years);
      },
      prices() {
        return this.filteredList.map(item => item.price);
      },
      minPrice() {
        return Math.min(...this.prices).toFixed(2);
      },
      maxPrice() {
        return Math.max(...this.prices).toFixed(2);
      },
      averagePrice() {
        return (this.prices.reduce((sum, price) => sum + price, 0) / this.prices.length).toFixed(2);
      },
      chartData() {
        return {
          datasets: [
            {
              label: 'Price to Year',
              backgroundColor: '#1976d2',
              data: this.filteredList.map(item => {
                return {x: Number(item.year), y: item.price};
              }),
            }
          ],
        };
      },
    },
    methods: {
      handleUpload(newItems) {
        this.items = this.items.concat(newItems);
      },
      sortBy(field) {
        this.sortedBy = field;
        this.isAscending = !this.isAscending;
      },
      removeAll() {
        this.items = [];
      },
      removeItem(index) {
        this.items.splice(index, 1);
      }
    },
    watch: {
      items(newItems) {
        localStorage.setItem('ads', JSON.stringify(newItems));
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../sass/variables';

  .ads {
    padding: 0;
    margin: 0;
    display: grid;
    grid: auto / repeat(3, 1fr);
    grid-gap: $base-margin;

    &__sorting,
    &__filters,
    &__stats {
      margin: $base-margin 0;
    }

    &__stats {
      display: grid;
      grid: auto / 3fr 1fr;
      grid-gap: $base-margin;

      &--chart {
        position: relative;
        height: 300px;
        width: 75%;
      }
    }
  }
</style>
