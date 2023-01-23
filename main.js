import Vue from 'vue';
import App from './App';
import uView from 'uview-ui';
import './app.scss';
import * as constants from './constants';
import * as utils from './utils';
import * as apis from './apis.js';
import http from './uview-ui/libs/request';

Vue.config.productionTip = false;
Vue.prototype.$constants = constants;
Vue.prototype.$utils = utils;
Vue.prototype.$apis = apis;
Vue.prototype.$http = http;

Vue.use(uView);

App.mpType = 'app';

const app = new Vue({
  ...App,
});
app.$mount();
