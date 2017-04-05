import Vue from 'vue'

import store from './includes/store'
import router from './includes/router'

// window.addEventListener("touchmove", function(e) {
//     console.log(e)
//   if (!e.target.classList.contains('scrollable')) {
//     e.preventDefault();
//   }
// }, false);

new Vue({
    router,
    store,
    el: '#app',
    render: h => h('router-view')
})