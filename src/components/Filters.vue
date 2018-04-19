<template>
  <section class="ads__filters">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="select is-fullwidth">
          <select v-model="yearFrom">
            <option value="">Year From</option>
            <option v-for="year in $store.getters.years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="select is-fullwidth">
          <select v-model="yearTo">
            <option value="">Year To</option>
            <option v-for="year in $store.getters.years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <div class="tile is-parent">
        <button class="button is-fullwidth" :class="{'is-success': withMileage}"
                @click="withMileage = !withMileage">
          Only With Mileage
        </button>
      </div>
      <div class="tile is-parent">
        <input type="text" class="input is-fullwidth" placeholder="Location" v-model.lazy="location"/>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent" v-for="model in $store.getters.models" :key="model">
        <button class="button is-fullwidth" :class="{'is-success': models.indexOf(model) !== -1}"
                @click="toggleModel(model)">
          {{ model }}
        </button>
      </div>
      <div class="tile is-parent" v-for="source in $store.getters.sources" :key="source">
        <button class="button is-fullwidth" :class="{'is-success': sources.indexOf(source) !== -1}"
                @click="toggleSource(source)">
          {{ source }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      yearFrom: this.$store.state.filters.yearFrom || '',
      yearTo: this.$store.state.filters.yearTo || '',
      models: this.$store.state.filters.models || [],
      sources: this.$store.state.filters.sources || [],
      withMileage: this.$store.state.filters.withMileage || false,
      location: this.$store.state.filters.location || '',
    };
  },
  watch: {
    yearFrom(value) {
      this.changeFilter({yearFrom: value});
    },
    yearTo(value) {
      this.changeFilter({yearTo: value});
    },
    models(value) {
      this.changeFilter({models: value});
    },
    sources(value) {
      this.changeFilter({sources: value});
    },
    withMileage(value) {
      this.changeFilter({withMileage: value});
    },
    location(value) {
      this.location = value.toLowerCase();
      this.changeFilter({location: this.location});
    },
  },
  methods: {
    changeFilter(data) {
      this.$store.dispatch('setFilters', data);
    },
    toggleModel(model) {
      const index = this.models.indexOf(model);
      if (index === -1) {
        this.models.push(model);
      } else {
        this.models.splice(index, 1);
      }
    },
    toggleSource(source) {
      const index = this.sources.indexOf(source);
      if (index === -1) {
        this.sources.push(source);
      } else {
        this.sources.splice(index, 1);
      }
    },
  },
};
</script>
