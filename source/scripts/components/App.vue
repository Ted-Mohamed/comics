<template>
    <div ref="container"
         class="container">
        <div ref="previous"
             class="page previous">
            <img :src="previousURL">
        </div>
        <div ref="current"
             class="page current">
            <img :src="currentURL">
        </div>
        <div ref="next"
             class="page next">
            <img :src="nextURL">
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
        },
        previousURL() {
            return this.$store.getters.previousURL ? `./assets/comics/${this.$store.getters.previousURL}` : './assets/images/nomore.jpg'
        },
        nextURL() {
            return this.$store.getters.nextURL ? `./assets/comics/${this.$store.getters.nextURL}` : './assets/images/nomore.jpg'
        }
    },

    data: () => ({

    }),

    methods: {
        onSwipe(direction) {
            const [action, element, translation] = direction == 'left' ?
                ['nextPage', this.$refs.current, 'translateX(-100%)']
                : ['previousPage', this.$refs.previous, 'translateX(100%)']

            window.requestAnimationFrame(() => {
                element.classList.add('animate')
                element.style.transform = translation

                onetime(element, 'transitionend', () => {
                    element.classList.remove('animate')
                    this.$store.dispatch(action)
                    this.$nextTick(this.reset)
                })
            })
        },

        reset() {
            window.requestAnimationFrame(() => {
                this.$refs.previous.style.transform = `translateX(0)`
                this.$refs.current.style.transform = `translateX(0)`
            })
        },
    },
    mounted() {
        const HM = new Hammer.Manager(this.$refs.container)

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
                this.onSwipe(e.deltaX > 0 ? 'right' : 'left')
            } else {
                this.reset()
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
    backface-visibility: hidden;
}

.animate {
    transition: transform .25s;
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

.page.previous,
.page.current {
    box-shadow: 5px 0 20px rgba(0,0,0, .5), 20px 0 100px rgba(0,0,0, .2)
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