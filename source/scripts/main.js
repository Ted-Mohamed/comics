import Vue from 'vue'

import store from './includes/store'
import router from './includes/router'

new Vue({
    router,
    store,
    el: '#app',
    render: h => h('router-view')
})