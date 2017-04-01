import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex)
Vue.use(VueRouter)

import manifest from './manifest.json'

function start() {
    let currentVolume = firsNotNullIndex(manifest)
    let currentChapter = firsNotNullIndex(manifest[currentVolume])
    let currentPage = firsNotNullIndex(manifest[currentVolume][currentChapter])

    return { currentVolume, currentChapter, currentPage }
}

function firsNotNullIndex(array) {
    let index = 0
    while (index < array.length && !array[index]) { index++ }
    return index
}

const store = new Vuex.Store({
    state: start(),
    getters: {
        currentURL(state) {
            return manifest[state.currentVolume][state.currentChapter][state.currentPage]
        },
        previousURL(state) {
            return manifest[state.currentVolume][state.currentChapter][state.currentPage - 1]
        },
        nextURL(state) {
            return manifest[state.currentVolume][state.currentChapter][state.currentPage + 1]
        }
    },
    mutations: {
        nextPage(state) {
            if (manifest[state.currentVolume][state.currentChapter][state.currentPage + 1]) {
                state.currentPage += 1
            } else if (manifest[state.currentVolume][state.currentChapter + 1]) {
                state.currentChapter += 1
                state.currentPage = firsNotNullIndex(manifest[state.currentVolume][state.currentChapter])
            } else if (manifest[state.currentVolume + 1]) {
                state.currentVolume += 1
                state.currentChapter = firsNotNullIndex(manifest[state.currentVolume])
                state.currentPage = firsNotNullIndex(manifest[state.currentVolume][state.currentChapter])

            }
        },
        previousPage(state) {
            if (manifest[state.currentVolume][state.currentChapter][state.currentPage - 1]) {
                state.currentPage -= 1
            } else if (manifest[state.currentVolume][state.currentChapter - 1]) {
                state.currentChapter -= 1
                state.currentPage = firsNotNullIndex(manifest[state.currentVolume][state.currentChapter])
            } else if (manifest[state.currentVolume - 1]) {
                state.currentVolume -= 1
                state.currentChapter = firsNotNullIndex(manifest[state.currentVolume])
                state.currentPage = firsNotNullIndex(manifest[state.currentVolume][state.currentChapter])
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
            path: '/',
            redirect: `/${store.state.currentVolume}/${store.state.currentChapter}/${store.state.currentPage}`
        },
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