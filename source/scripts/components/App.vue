<template>
    <div ref="container"
         class="container">
        <div ref="current"
             class="page current">
            <img :key="currentURL"
                 :src="currentURL">
        </div>
    </div>
</template>

<script>
import Hammer from 'hammerjs'

function onetime(node, type, callback) {
    node.addEventListener(type, function (e) {
        e.target.removeEventListener(e.type, arguments.callee);
        return callback(e);
    });

}
export default {
    name: "App",
    computed: {
        currentURL() {
            return `./assets/comics/${this.$store.getters.currentURL}`
        }
    },

    data: () => ({

    }),

    methods: {
        onSwipe(direction) {
            console.log(direction)
            this.$store.dispatch(direction == 'left' ? 'nextPage' : 'previousPage')
        }
    },
    mounted() {
        const HM = new Hammer.Manager(this.$refs.container)

        HM.add(new Hammer.Swipe({
            direction: Hammer.DIRECTION_HORIZONTAL,
        }));

        HM.on('swipeleft swiperight', (e) => {
            this.onSwipe(e.type == 'swipeleft' ? 'left' : 'right')
        })
    }
}
</script>

<style>
.container {
    display: flex;
    width: 100vw;
    backface-visibility: hidden;
}

.animate {
    transition: transform .25s cubic-bezier(0.25, 0, 1, 1);
}

.page {
    width: 100%;
    flex-shrink: 0;
    position: absolute;
    backface-visibility: hidden;
    will-change: transform;
}

img {
    backface-visibility: hidden;
    pointer-events: none;
    width: 100%;
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