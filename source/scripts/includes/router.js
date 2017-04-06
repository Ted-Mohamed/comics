import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import App from '../components/App.vue'

export default new VueRouter({
    routes: [
        { path: '/', redirect: '/0' },
        {
            path: '/:page',
            component: App,
            props: (route) => ({
                showInput: route.query['input'] !== undefined,
                page: parseInt(route.params.page)
            }),
        }
    ],
})