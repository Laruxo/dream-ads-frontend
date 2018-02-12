import Vue from 'vue';
import Router from 'vue-router';

import Uploader from '../components/Uploader.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Uploader',
      component: Uploader,
    },
  ],
});
