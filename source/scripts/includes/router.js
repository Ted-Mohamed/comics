import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)



import App from '../components/App.vue'

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: App,
        },
        {
            path: '/chat',
            component: App,
            props: { showInput: true}
        },
        {
            path: '/chat/:id',
            component: App,
            props: (route) => ({
                showInput: true,
                id: parseInt(route.params.id)
            })
        },
        {
            path: '/:id',
            component: App,
            props: (route) => ({
                id: parseInt(route.params.id)
            })
        }
    ]
})
