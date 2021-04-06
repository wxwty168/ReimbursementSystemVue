// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import store from "./vuex/store";
import store from './store/'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import  "./assets/style/common.css"
import  './assets/style/element-ui.css'
import  './assets/style/scrollBar.css'
Vue.use(ElementUI);

import axios from 'axios';
axios.defaults.baseURL='http://localhost:8088/';
Vue.prototype.axios = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
