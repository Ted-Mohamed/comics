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
        goToPage(state, id) {
            if(manifest[id]) {
                state.currentPage = id
                return manifest[state.currentPage]
            }
        },
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
        goToPage: ({commit}, id) => commit('goToPage', id),
        nextPage: ({ commit }) => commit('nextPage'),
        previousPage: ({ commit }) => commit('previousPage'),
    },
})