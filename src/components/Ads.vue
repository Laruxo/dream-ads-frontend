<template>
  <section class="section">
    <div class="ads__charts">
      <div class="ads__chart">
        <h4 class="ads__chart-title title is-4 is-marginless">Price Over Years</h4>
        <scatter-chart :chart-data="chartData.price" :height="300"></scatter-chart>
      </div>
      <div class="ads__chart">
        <h4 class="ads__chart-title title is-4 is-marginless">Mileage Over Years</h4>
        <scatter-chart :chart-data="chartData.mileage" :height="300"></scatter-chart>
      </div>
    </div>
    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Model</th>
          <th>Available Starting</th>
          <th>Available Until</th>
          <th>Min Price</th>
          <th>Max Price</th>
          <th>Average Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(stat, group) in stats" :key="group">
          <td>{{ group }}</td>
          <td>{{ stat.minYear }}</td>
          <td>{{ stat.maxYear }}</td>
          <td>{{ stat.min }}&euro;</td>
          <td>{{ stat.max }}&euro;</td>
          <td>{{ stat.average }}&euro;</td>
        </tr>
      </tbody>
    </table>
    <div class="ads__filters">
      <div class="select">
        <select v-model="yearFrom">
          <option value="">Year From</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="select">
        <select v-model="yearTo">
          <option value="">Year To</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="select">
        <select v-model="group">
          <option value="">Model</option>
          <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
        </select>
      </div>
      <div class="select">
        <select v-model="source">
          <option value="">Source</option>
          <option v-for="source in sources" :key="source" :value="source">{{ source }}</option>
        </select>
      </div>
      <button class="button" :class="{ 'is-primary': withMileage }"
              @click="withMileage = !withMileage">Only with mileage
      </button>
      <button class="button is-danger" @click="$store.commit('removeAllAds')">
        Remove All
      </button>
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
        <button class="button is-primary" @click="sortBy('date')">
          Updated {{ sortedBy === 'date' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
        </button>
      </div>
    </div>
    <transition-group name="ad" tag="ul" class="ads">
      <li is="ad" v-for="item in sortedList" :key="item.id"
          :item="item" @remove="$store.commit('removeAd', item.id)"></li>
    </transition-group>
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
        isAscending: true,
        sortedBy: 'price',
        yearFrom: '',
        yearTo: '',
        group: '',
        source: '',
        withMileage: false,
      };
    },
    mounted() {
      try {
        if (this.$store.state.ads && this.$store.state.ads.length) {
          this.yearFrom = this.years[0];
          this.yearTo = this.years[this.years.length - 1];
        }
      } catch (e) {
        console.error('Error parsing local data.', e);
      }
    },
    computed: {
      filteredList() {
        let items = this.$store.state.ads.slice(0);
        const conditions = [];

        if (this.yearFrom) {
          conditions.push(item => item.year >= this.yearFrom);
        }

        if (this.yearTo) {
          conditions.push(item => item.year <= this.yearTo);
        }

        if (this.model) {
          conditions.push(item => item.model === this.model);
        }

        if (this.source) {
          conditions.push(item => item.link.indexOf(this.source) !== -1);
        }

        if (this.withMileage) {
          conditions.push(item => item.mileage > 0);
        }

        if (conditions.length) {
          items = items.filter(item => {
            for (const condition of conditions) {
              if (!condition(item)) {
                return false;
              }
            }
            return true;
          });
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

          return a.price - b.price || a.id.localeCompare(b.id);
        });
      },
      years() {
        return Array.from(
          new Set(
            this.$store.state.ads.map(item => item.year),
          ),
        ).sort();
      },
      groups() {
        return Array.from(
          new Set(
            this.$store.state.ads.map(item => item.model),
          ),
        );
      },
      sources() {
        return Array.from(
          new Set(
            this.$store.state.ads.map(item => {
              const matches = item.link.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
              return matches && matches[1];
            }),
          ),
        );
      },
      groupedData() {
        const data = {};
        for (let item of this.filteredList) {
          if (!data[item.model]) {
            data[item.model] = {
              priceOverYears: [],
              mileageOverYears: [],
              items: [],
            };
          }
          data[item.model].items.push(item);
          data[item.model].priceOverYears.push({x: Number(item.year), y: item.price});
          data[item.model].mileageOverYears.push({x: Number(item.year), y: item.mileage});
        }

        return data;
      },
      stats() {
        const stats = {};

        for (let group in this.groupedData) {
          if (this.groupedData.hasOwnProperty(group)) {
            stats[group] = {
              min: this.min(this.groupedData[group].items, 'price').toFixed(2),
              max: this.max(this.groupedData[group].items, 'price').toFixed(2),
              average: this.average(this.groupedData[group].items, 'price'),
              minYear: this.min(this.groupedData[group].items, 'year'),
              maxYear: this.max(this.groupedData[group].items, 'year'),
            };
          }
        }

        stats['All'] = {
          min: this.min(this.filteredList, 'price').toFixed(2),
          max: this.max(this.filteredList, 'price').toFixed(2),
          average: this.average(this.filteredList, 'price'),
          minYear: this.years[0],
          maxYear: this.years[this.years.length - 1],
        };

        return stats;
      },
      chartData() {
        const priceData = [];
        const mileageData = [];
        for (let group in this.groupedData) {
          if (this.groupedData.hasOwnProperty(group)) {
            const color = '#' + Math.random().toString(16).slice(-6);
            priceData.push({
              label: group,
              backgroundColor: color,
              pointRadius: 5,
              data: this.groupedData[group].priceOverYears,
            });
            mileageData.push({
              label: group,
              backgroundColor: color,
              pointRadius: 5,
              data: this.groupedData[group].mileageOverYears,
            });
          }
        }
        return {
          price: {
            datasets: priceData,
          },
          mileage: {
            datasets: mileageData,
          },
        };
      },
    },
    methods: {
      sortBy(field) {
        this.sortedBy = field;
        this.isAscending = !this.isAscending;
      },
      min(items, field) {
        return items.reduce((min, item) => {
          min = min[field] || min;
          const value = (field ? item[field] : item);
          return value < min ? value : min
        }, Infinity);
      },
      max(items, field) {
        return items.reduce((max, item) => {
          max = max[field] || max;
          const value = (field ? item[field] : item);
          return value > max ? value : max
        }, -Infinity);
      },
      average(items, field) {
        const sum = items.reduce((sum, item) => sum + (field ? item[field] : item), 0);
        return (sum / items.length).toFixed(2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../sass/variables';

  .ads {
    display: grid;
    grid: auto / repeat(3, 1fr);
    grid-gap: $gap;
    position: relative;

    &__charts,
    &__stats,
    &__sorting,
    &__filters {
      margin: $gap 0;
    }

    &__charts {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
