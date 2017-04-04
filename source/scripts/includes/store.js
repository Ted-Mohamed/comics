import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import manifest from '../manifest.json'

export default new Vuex.Store({
    state: {
        currentPage: 0
    },
    getters: {
        currentURL(state) {
            return manifest[state.currentPage]
        },
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
    },
})