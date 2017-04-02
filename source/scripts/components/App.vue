<template>
    <div ref="container"
         class="container">
        <div ref="previous"
             class="page previous">
            <img :src="previousURL ? `./assets/comics/${previousURL}`: './assets/comics/1/05/07.jpg'">
        </div>
        <div ref="current"
             class="page current">
            <img :src="`./assets/comics/${currentURL}`">
        </div>
        <div ref="next"
             class="page next">
            <img :src="`./assets/comics/${nextURL}`">
        </div>
    </div>
</template>

<script>
import Hammer from 'hammerjs'
export default {
    name: "App",
    computed: {
        currentURL() {
            return this.$store.getters.currentURL
        },
        previousURL() {
            return this.$store.getters.previousURL
        },
        nextURL() {
            return this.$store.getters.nextURL
        }
    },

    data: () => ({

    }),

    methods: {
        onSwipeLeft() {
            this.$store.dispatch('nextPage')
        },
        onSwipeRight() {
            this.$store.dispatch('previousPage')
        }
    },

    mounted() {
        const HM = new Hammer.Manager(this.$refs.container, { touchAction: 'auto' })

        HM.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_HORIZONTAL
        }));

        HM.on('panleft panright', (e) => {
            window.requestAnimationFrame(() => {
                this.$refs.previous.style.transform = `translateX(${e.deltaX > 0 ? e.deltaX : 0}px)`
                this.$refs.current.style.transform = `translateX(${e.deltaX > 0 ? 0 : e.deltaX}px)`
            })
        })

        HM.on('pancancel panend', (e) => {

            if (Math.abs(e.deltaX / window.innerWidth) > .4) {
                window.requestAnimationFrame(() => {
                    this.$refs.previous.style.transform = `translateX(${e.deltaX > 0 ? 100 : 0}%)`
                    this.$refs.current.style.transform = `translateX(${e.deltaX > 0 ? 0 : 100}%)`
                    this[`onSwipe${e.deltaX > 0 ? 'Right' : 'Left'}`]()
                    this.$nextTick(() => {
                        this.$refs.previous.style.transform = `translateX(0)`
                        this.$refs.current.style.transform = `translateX(0)`
                    })
                })
            } else {
                window.requestAnimationFrame(() => {
                    this.$refs.previous.style.transform = `translateX(0)`
                    this.$refs.current.style.transform = `translateX(0)`
                })
            }
        })

        // HM.enable = false
    }
}
</script>

<style>
.container {
    display: flex;
    width: 100vw;
    -webkit-backface-visibility: hidden;
}

.page {
    width: 100%;
    flex-shrink: 0;
    position: absolute;
    -webkit-backface-visibility: hidden;
}

img {
    pointer-events: none;
    width: 100%;
    -webkit-backface-visibility: hidden;
}

.page.previous {
    left: -100%;
    z-index: 3
}

.page.current {
    z-index: 2
}

.page.next {
    z-index: 1
}
</style>