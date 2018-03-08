import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    ads: JSON.parse(localStorage.getItem('ads') || '[]'),
    ignored: JSON.parse(localStorage.getItem('ignored') || '[]'),
  },
  getters: {
    isIgnored: state => id => {
      return state.ignored.indexOf(id) !== -1;
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
  },
});
