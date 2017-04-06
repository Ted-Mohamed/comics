import Vue from 'vue'

import store from './includes/store'
import router from './includes/router'

// router.beforeEach((to, from, next) => {
//     store.dispatch('goToPage', parseInt(to.params.id)).then(() => { next() }).catch(() => { next(false) })
// })

new Vue({
    router,
    store,
    el: '#app',
    render: h => h('router-view')
})