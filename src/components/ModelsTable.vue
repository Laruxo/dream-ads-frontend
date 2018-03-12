<template>
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
      <tr v-for="(stat, model) in stats" :key="model">
        <td>{{ model }}</td>
        <td>{{ stat.minYear }}</td>
        <td>{{ stat.maxYear }}</td>
        <td>{{ stat.min | money }}&euro;</td>
        <td>{{ stat.max | money }}&euro;</td>
        <td>{{ stat.average | money }}&euro;</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  },
  computed: {
    stats() {
      let sum = 0;
      let min = Infinity;
      let max = 0;
      let minYear = Infinity;
      let maxYear = 0;

      const stats = {};
      for (const group in this.data) {
        if (this.data.hasOwnProperty(group)) {
          stats[group] = {
            average: this.average(this.data[group].items, 'price'),
            min: this.min(this.data[group].items, 'price'),
            max: this.max(this.data[group].items, 'price'),
            minYear: this.min(this.data[group].items, 'year'),
            maxYear: this.max(this.data[group].items, 'year'),
          };
          sum += stats[group].average;
          min = Math.min(min, stats[group].min);
          max = Math.max(max, stats[group].max);
          minYear = Math.min(minYear, stats[group].minYear);
          maxYear = Math.max(maxYear, stats[group].maxYear);
        }
      }

      stats['All'] = {
        average: sum / Object.keys(stats).length,
        min: min,
        max: max,
        minYear: minYear,
        maxYear: maxYear,
      };

      return stats;
    },
  },
  methods: {
    min(items, field) {
      return items.reduce((min, item) => {
        min = min[field] || min;
        const value = (field ? item[field] : item);
        return value < min ? value : min;
      }, Infinity);
    },
    max(items, field) {
      return items.reduce((max, item) => {
        max = max[field] || max;
        const value = (field ? item[field] : item);
        return value > max ? value : max;
      }, -Infinity);
    },
    average(items, field) {
      const sum = items.reduce((sum, item) => sum + (field ? item[field] : item), 0);
      return sum / items.length;
    },
  },
};
</script>
