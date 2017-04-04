import Vue from 'vue'
import store from './includes/store'

import App from './components/Messaging.vue'

new Vue({
    store,
    el: '#app',
    render: h => h(App)
});