<template>
    <div ref="container"
         class="container">
        <div ref="previous"
             class="page previous">
            <transition name="fade">
                <img :key="previousURL"
                     :src="previousURL">
            </transition>
        </div>
        <div ref="current"
             class="page current">
            <transition name="fade">
                <img :key="currentURL"
                     :src="currentURL">
            </transition>
        </div>
        <div ref="next"
             class="page next">
            <transition name="fade">
                <img :key="previousURL"
                     :src="nextURL">
            </transition>
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
            direction: Hammer.DIRECTION_HORIZONTAL,
            enable: function () {
                return screen[window.orientation == 90 ? 'height' : 'width'] == window.innerWidth;
            }
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
    }
}
</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter, .fade-leave-to
/* .component-fade-leave-active for <2.1.8 */ {
  opacity: 0;
}

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

.page.previous,
.page.current {
    box-shadow: 5px 0 20px rgba(0, 0, 0, .5), 20px 0 100px rgba(0, 0, 0, .2)
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