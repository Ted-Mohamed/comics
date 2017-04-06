import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import App from '../components/App.vue'

export default new VueRouter({
    routes: [
        { path: '/', redirect: '/0' },
        {
            path: '/:id',
            component: App,
            props: (route) => ({
                showInput: route.query['input'] !== undefined,
                id: parseInt(route.params.id)
            }),
        }
    ],
})