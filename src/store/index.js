import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    ads: JSON.parse(localStorage.getItem('ads') || '[]'),
    ignored: JSON.parse(localStorage.getItem('ignored') || '[]'),
    filters: JSON.parse(localStorage.getItem('filters') || '{}'),
  },
  getters: {
    isIgnored: state => id => {
      return state.ignored.indexOf(id) !== -1;
    },
    filteredAds: state => {
      let items = state.ads.slice(0);
      const conditions = [];

      if (state.filters.yearFrom) {
        conditions.push(item => item.year >= state.filters.yearFrom);
      }

      if (state.filters.yearTo) {
        conditions.push(item => item.year <= state.filters.yearTo);
      }

      if (state.filters.model) {
        conditions.push(item => item.model === state.filters.model);
      }

      if (state.filters.sources) {
        conditions.push(
          item => state.filters.sources.some(
            link => item.link.indexOf(link) !== -1
          )
        );
      }

      if (state.filters.withMileage) {
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
  },
  actions: {
    addAd({state, getters, commit}, item) {
      if (!item.active) {
        commit('removeAd', item.id);
        return 'Expired ' + item.id;
      }

      if (getters.isIgnored(item.id)) {
        return 'Skipped ' + item.id;
      }

      const index = state.ads.findIndex(ad => ad.id === item.id);
      if (index === -1) {
        commit('addAd', item);
        return 'Added ' + item.id;
      }

      commit('updateAd', {index: index, item: item});
      return 'Updated ' + item.id;
    },
    removeAd({commit}, id) {
      commit('removeAd', id);
    },
    removeAllAds({commit}) {
      commit('removeAllAds');
    },
    setFilters({commit}, filters) {
      commit('setFilters', filters);
    },
  },
  mutations: {
    addAd(state, item) {
      state.ads.push(item);
      localStorage.setItem('ads', JSON.stringify(state.ads));
    },
    updateAd(state, {index, item}) {
      // item updated. Show it?
      state.ads[index] = item;
    },
    removeAllAds(state) {
      state.ads = [];
      localStorage.setItem('ads', JSON.stringify(state.ads));
    },
    removeAd(state, id) {
      const index = state.ads.findIndex(item => item.id === id);
      if (index !== -1) {
        state.ads.splice(index, 1);
        localStorage.setItem('ads', JSON.stringify(state.ads));

        state.ignored.push(id);
        localStorage.setItem('ignored', JSON.stringify(state.ignored));
      }
    },
    setFilters(state, filters) {
      state.filters = Object.assign({}, state.filters, filters);
      localStorage.setItem('filters', JSON.stringify(state.filters));
    },
  },
});
