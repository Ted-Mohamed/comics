import Vue from 'vue'

import VueTouch from 'vue-touch'
Vue.use(VueTouch)

import {router, store} from './store'

import App from './components/App.vue'

new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
});