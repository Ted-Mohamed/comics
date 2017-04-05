import Vue from 'vue'
import store from './includes/store'

import App from './components/App.vue'

// window.addEventListener("touchmove", function(e) {
//     console.log(e)
//   if (!e.target.classList.contains('scrollable')) {
//     e.preventDefault();
//   }
// }, false);

new Vue({
    store,
    el: '#app',
    render: h => h(App)
});