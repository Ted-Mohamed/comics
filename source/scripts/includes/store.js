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
        goToPage(state, number) {
            if (manifest[number]) {
                state.currentPage = number
            }
        },
    },
    actions: {
        goToPage: ({ state, commit }, number) => new Promise((resolve, reject) => {
            if (manifest[number]) {
                commit('goToPage', number)
                resolve()
            } else {
                reject()
            }
        })
    },
})