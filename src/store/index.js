import Vue from 'vue';
import Vuex from 'vuex';
import Dexie from 'dexie';

Vue.use(Vuex);

const db = new Dexie('Ads');
db.version(1).stores({
  ads: 'id, link, model, mileage, year, location',
});

export default new Vuex.Store({
  // strict: true,
  state: {
    db: db,
    filteredAds: [],
    filters: JSON.parse(localStorage.getItem('filters') || '{}'),
    years: [],
    models: [],
    sources: [],
    downloadUrl: '',
  },
  actions: {
    async initDb({state, commit}) {
      const years = Array.from(
        new Set(
          await state.db.ads.orderBy('year').filter(
            item => item.active === true && item.ignored === false
          ).keys()
        )
      );
      const models = Array.from(
        new Set(
          await state.db.ads.orderBy('model').filter(
            item => item.active === true && item.ignored === false
          ).keys(),
        ),
      );
      const links = await state.db.ads.orderBy('link').filter(
        item => item.active === true && item.ignored === false
      ).keys();
      const sources = Array.from(
        new Set(
          links.map(link => {
            const matches = link.match(/^https?:\/\/([^/:?#]+)(?:[/:?#]|$)/i);
            return matches && matches[1];
          }),
        ),
      );
      commit('setInitialState', {years, models, sources});
    },
    addAd({commit, dispatch}, item) {
      commit('addAd', item);
      dispatch('filterAds');
    },
    ignoreAd({commit, dispatch}, id) {
      commit('ignoreAd', id);
      dispatch('filterAds');
    },
    removeAllAds({commit, dispatch}) {
      commit('removeAllAds');
      dispatch('filterAds');
    },
    async saveAds({state}) {
      const data = await state.db.ads.toArray().then(rows => ({ads: Object.assign({}, rows)}));

      const file = new Blob([JSON.stringify(data)], {type: 'application/json'});
      state.downloadUrl = URL.createObjectURL(file);
      setTimeout(() => {
        state.downloadUrl = '';
      }, 10000);
    },
    setFilters({commit, dispatch}, filters) {
      commit('setFilters', filters);
      dispatch('filterAds');
    },
    async filterAds({commit, state}) {
      const data = await state.db.transaction('r', db.ads, async() => {
        let query = state.db.ads.filter(item => item.active === true && item.ignored === false);

        if (state.filters.yearFrom) {
          // query = query.or('year').aboveOrEqual(state.filters.yearFrom);
          query = query.filter(
            item => item.year >= state.filters.yearFrom
          );
        }

        if (state.filters.yearTo) {
          // query = query.or('year').belowOrEqual(state.filters.yearTo);
          query = query.filter(
            item => item.year <= state.filters.yearTo
          );
        }

        if (state.filters.models) {
          // query = query.or('model').anyOf(state.filters.models);
          query = query.filter(
            item => state.filters.models.some(model => item.model === model)
          );
        }

        if (state.filters.sources) {
          query = query.filter(
            item => state.filters.sources.some(link => item.link.indexOf(link) !== -1)
          );
        }

        if (state.filters.withMileage) {
          // query = query.or('mileage').above(0);
          query = query.filter(
            item => item.mileage > 0
          );
        }

        if (state.filters.location && state.filters.location.length > 2) {
          query = query.filter(
            item => item.location.toLowerCase().indexOf(state.filters.location) !== -1
          );
        }

        try {
          return query.toArray();
        } catch (e) {
          console.error(e);
        }

        return [];
      });
      commit('setFilteredAds', data);
    },
  },
  mutations: {
    setInitialState(state, data) {
      state.years = data.years;
      state.models = data.models;
      state.sources = data.sources;
    },
    addAd(state, item) {
      state.db.ads.put(item);
    },
    removeAllAds(state) {
      state.db.ads.delete();
    },
    ignoreAd(state, id) {
      state.db.ads.update(id, {ignored: true});
    },
    setFilters(state, filters) {
      state.filters = Object.assign({}, state.filters, filters);
      localStorage.setItem('filters', JSON.stringify(state.filters));
    },
    setFilteredAds(state, data) {
      state.filteredAds = data;
    },
  },
});
