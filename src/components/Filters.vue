<template>
  <section class="ads__filters">
    <div class="field is-grouped">
      <div class="control">
        <div class="select">
          <select v-model="yearFrom">
            <option value="">Year From</option>
            <option v-for="year in $store.getters.years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <div class="control">
        <div class="select">
          <select v-model="yearTo">
            <option value="">Year To</option>
            <option v-for="year in $store.getters.years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <div class="control">
        <button class="button" :class="{'is-primary': withMileage}"
                @click="withMileage = !withMileage">
          Only with mileage
        </button>
      </div>
      <div class="control">
        <input type="text" class="input" placeholder="Location" v-model.lazy="location"/>
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline">
      <p class="control" v-for="model in $store.getters.models" :key="model">
        <button class="button" :class="{'is-primary': models.indexOf(model) !== -1}"
                @click="toggleModel(model)">
          {{ model }}
        </button>
      </p>
    </div>
    <div class="field is-grouped is-grouped-multiline">
      <p class="control" v-for="source in $store.getters.sources" :key="source">
        <button class="button" :class="{'is-primary': sources.indexOf(source) !== -1}"
                @click="toggleSource(source)">
          {{ source }}
        </button>
      </p>
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
