<template>
    <div ref="container" class="container">
        <img ref="current"
             :src="`./assets/comics/${currentURL}`"
             class="current">
        <img v-show="panDirection == 'left'" ref="previous"
             :src="`./assets/comics/${previousURL}`"
             class="previous">
        <img v-show="panDirection == 'right'" ref="next"
             :src="`./assets/comics/${nextURL}`"
             class="next">
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
        panDirection: 'right'
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
        const hammer = new Hammer(this.$refs.container)
        hammer.on('panend pancancel', (event) => {
            const deltaX = event.deltaX / window.innerWidth
            this.$refs.current.style.transform = 'translateX(0)';
            this.$refs.previous.style.transform = 'translateX(0)';
            console.log(deltaX)
            if(deltaX > .4) {
                this.onSwipeRight()
            }

            if (deltaX < -.4) {
                this.onSwipeLeft()
            }
        });
        hammer.on('panleft panright', (event) => {
            if (event.deltaX > 0) {
                this.panDirection = 'left'
                this.$refs.previous.style.transform = `translateX(${event.deltaX}px)`;
            } else {
                this.panDirection = 'right'
                this.$refs.current.style.transform = `translateX(${event.deltaX}px)`;
            }
        })
    }
}
</script>

<style>
.container {
    position: relative;
}
img {
    pointer-events: none;
    width: 100%;
}
img:not(.current) {
    top: 0;
    left: 0;
    position: absolute;
}
img.previous {
    z-index: 2;
    left: -100%
}
img.current {
    transform: translateX(0);
    position: relative;
    z-index: 1
}
</style>