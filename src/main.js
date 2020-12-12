import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import HappyScroll from 'vue-happy-scroll';
import 'vue-happy-scroll/docs/happy-scroll.css';
Vue.use(HappyScroll);

import axios from './http'; //axios拦截器配置

Vue.config.productionTip = false; //阻止启动生产消息
Vue.use(ElementUI); //将ElementUI挂载到Vue上
Vue.prototype.$axios = axios; //将axios挂载到Vue的原型上


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')