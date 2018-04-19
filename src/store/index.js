import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  // strict: true,
  state: {
    ads: JSON.parse(localStorage.getItem('ads') || '[]'),
    filters: JSON.parse(localStorage.getItem('filters') || '{}'),
  },
  getters: {
    filteredAds(state) {
      let items = state.ads.slice(0);
      const conditions = [];

      if (state.filters.yearFrom) {
        conditions.push(item => item.year >= state.filters.yearFrom);
      }

      if (state.filters.yearTo) {
        conditions.push(item => item.year <= state.filters.yearTo);
      }

      if (state.filters.models) {
        conditions.push(
          item => state.filters.models.some(
            model => item.model === model,
          ),
        );
      }

      if (state.filters.sources) {
        conditions.push(
          item => state.filters.sources.some(
            link => item.link.indexOf(link) !== -1,
          ),
        );
      }

      if (state.filters.withMileage) {
        conditions.push(item => item.mileage > 0);
      }

      if (state.filters.location && state.filters.location.length > 2) {
        conditions.push(
          item => item.location.toLowerCase().indexOf(state.filters.location) !== -1,
        );
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
    years(state) {
      return Array.from(
        new Set(state.ads.map(item => item.year)),
      ).sort();
    },
    models(state) {
      return Array.from(
        new Set(state.ads.map(item => item.model)),
      );
    },
    sources(state) {
      return Array.from(
        new Set(
          state.ads.map(item => {
            const matches = item.link.match(/^https?:\/\/([^/:?#]+)(?:[/:?#]|$)/i);
            return matches && matches[1];
          }),
        ),
      );
    },
  },
  actions: {
    async init({commit}) {
      const response = await fetch('http://localhost:5000/api/ads', {
        mode: 'cors',
      });
      const data = await response.json();
      commit('setAds', data);
    },
    async updateAds({dispatch}) {
      try {
        const response = await fetch('http://localhost:5000/api/scrape', {
          mode: 'cors',
        });
        const data = await response.json();
        if (data === 'ok') {
          dispatch('init');
        }
      } catch (e) {
        console.error(e);
      }
    },
    async ignoreAd({commit}, id) {
      try {
        const response = await fetch(`http://localhost:5000/api/ignore/${id}`, {
          mode: 'cors',
        });
        const data = await response.json();
        if (data === 'ok') {
          commit('ignoreAd', id);
        }
      } catch (e) {
        console.error(e);
      }
    },
    removeAllAds({commit}) {
      commit('removeAllAds');
    },
    setFilters({commit}, filters) {
      commit('setFilters', filters);
    },
  },
  mutations: {
    setAds(state, data) {
      state.ads = data;
    },
    removeAllAds(state) {
      state.ads = [];
    },
    ignoreAd(state, id) {
      const index = state.ads.findIndex(item => item.id === id);
      if (index !== -1) {
        state.ads.splice(index, 1);
      }
    },
    setFilters(state, filters) {
      state.filters = Object.assign({}, state.filters, filters);
      localStorage.setItem('filters', JSON.stringify(state.filters));
    },
  },
});

store.watch(state => state.ads, newValue => {
  localStorage.setItem('ads', JSON.stringify(newValue));
});

export default store;
