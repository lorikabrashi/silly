// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueTouch from 'vue-touch';
import Toasted from 'vue-toasted';

import store from './store';
import router from './Routes';
import App from './App';
import layoutMixin from './mixins/layout';
import Widget from './components/Widget/Widget';
import VueCookies from 'vue-cookies'
import VueTables  from 'vue-tables-2';

Vue.use(BootstrapVue);
Vue.use(VueTouch);
Vue.use(VueCookies);
Vue.use(VueTables.ClientTable);

Vue.component('Widget', Widget);

Vue.mixin(layoutMixin);
Vue.use(Toasted, { duration: 10000 });

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
