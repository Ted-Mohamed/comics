import Vue from 'vue'

import VueTouch from 'vue-touch'
Vue.use(VueTouch)

import store from './store'


// import { sync } from 'vuex-router-sync'
// import router from './router'
// sync(store, router)

import App from './components/App.vue'

new Vue({
    store,
    el: '#app',
    render: h => h(App)
});