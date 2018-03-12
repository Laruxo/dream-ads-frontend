<template>
  <section class="ads__filters">
    <div class="field is-grouped">
      <div class="control">
        <div class="select">
          <select v-model="yearFrom">
            <option value="">Year From</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
      <div class="control">
        <div class="select">
          <select v-model="yearTo">
            <option value="">Year To</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
      <div class="control">
        <div class="select">
          <select v-model="model">
            <option value="">Model</option>
            <option v-for="model in models" :key="model" :value="model">{{ model }}</option>
          </select>
        </div>
      </div>
      <div class="control">
        <button class="button" :class="{'is-primary': withMileage}"
                @click="withMileage = !withMileage">
          Only with mileage
        </button>
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline">
      <p class="control" v-for="source in sources" :key="source">
        <button class="button" :class="{'is-primary': sourceFilter.indexOf(source) !== -1}"
                @click="toggleSource(source)">
          {{ source }}
        </button>
      </p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      yearFrom: this.$store.state.filters.yearFrom || '',
      yearTo: this.$store.state.filters.yearTo || '',
      model: this.$store.state.filters.model || '',
      sourceFilter: this.$store.state.filters.sources || [],
      withMileage: this.$store.state.filters.withMileage || false,
    };
  },
  computed: {
    years() {
      return Array.from(
        new Set(
          this.data.map(item => item.year),
        ),
      ).sort();
    },
    models() {
      return Array.from(
        new Set(
          this.data.map(item => item.model),
        ),
      );
    },
    sources() {
      return Array.from(
        new Set(
          this.data.map(item => {
            const matches = item.link.match(/^https?:\/\/([^/:?#]+)(?:[/:?#]|$)/i);
            return matches && matches[1];
          }),
        ),
      );
    },
  },
  watch: {
    yearFrom(value) {
      this.changeFilter({yearFrom: value});
    },
    yearTo(value) {
      this.changeFilter({yearTo: value});
    },
    model(value) {
      this.changeFilter({model: value});
    },
    sourceFilter(value) {
      this.changeFilter({sources: value});
    },
    withMileage(value) {
      this.changeFilter({withMileage: value});
    },
  },
  methods: {
    changeFilter(data) {
      this.$emit('filter-change', data);
    },
    toggleSource(source) {
      const index = this.sourceFilter.indexOf(source);
      if (index === -1) {
        this.sourceFilter.push(source);
      } else {
        this.sourceFilter.splice(index, 1);
      }
    },
  },
};
</script>
