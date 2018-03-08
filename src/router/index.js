import Vue from 'vue';
import Router from 'vue-router';

import Ads from '../components/Ads';
import Uploader from '../components/Uploader';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Ads,
    },
    {
      path: '/upload',
      name: 'upload',
      component: Uploader,
    },
  ],
});
