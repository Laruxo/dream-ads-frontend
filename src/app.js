import Vue from 'vue';
import store from './store';
import router from './router';
import App from './App.vue';
import VueLazyLoad from 'vue-lazyload';

Vue.filter('money', function(value) {
  return Number(value).toFixed(0);
});

Vue.use(VueLazyLoad, {
  preLoad: 2,
  attempt: 1,
});

new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App),
});
