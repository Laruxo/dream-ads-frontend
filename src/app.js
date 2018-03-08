import Vue from 'vue';
import store from './store';
import router from './router';
import App from './App.vue';

new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App),
});
