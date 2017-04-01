import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex)
Vue.use(VueRouter)

import manifest from './manifest.json'

const store = new Vuex.Store({
    state: {
        currentPage: 0
    },
    getters: {
        currentURL(state) {
            return manifest[state.currentPage]
        },
        previousURL(state) {
            return manifest[state.currentPage - 1]
        },
        nextURL(state) {
            return manifest[state.currentPage + 1]
        }
    },
    mutations: {
        nextPage(state) {
            if (manifest[state.currentPage + 1]) {
                state.currentPage += 1
            }
        },
        previousPage(state) {
            if (manifest[state.currentPage - 1]) {
                state.currentPage -= 1
            }
        }
    },
    actions: {
        nextPage: ({ commit }) => commit('nextPage'),
        previousPage: ({ commit }) => commit('previousPage'),
    }
})

// Page('/:volume/:chapter/:page', function(context, next) {
//     console.log(context, next)
// })
// Page(function(context, next) {
//     console.log(context)
//     console.log(context.path.match(/\/d+\/d+\/d+/) == null)
// //    Page(`#/${store.state.currentVolume}/${store.state.currentChapter}/${store.state.currentPage}`)
// })
// Page({
//     hashbang: true
// })
const router = new VueRouter({
    routes: [
        {
            path: '/:volume/:chapter/:page',
            beforeEnter() {
                // console.log(arguments)
            }
        }
    ]
})

export { store }
export { router }