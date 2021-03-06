<template>
    <div ref="container"
         class="container">
        <transition name="fade">
            <Confetti v-if="ShowConfetti"></Confetti>
        </transition>
        <ChatView @newmessage="onNewMessage"
                  :showInput="showInput"></ChatView>
        <transition :name="direction"
                    mode="out-in">
            <ZoomableImage :key="currentURL"
                           @swipe="onSwipe"
                           :src="currentURL"></ZoomableImage>
        </transition>
    </div>
</template>

<script>
import ZoomableImage from './ZoomableImage.vue'
import ChatView from './ChatView.vue'
import Confetti from './Confetti.vue'
export default {
    name: "App",
    props: {
        page: {
            type: Number,
            default: 0
        },
        showInput: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        direction: '',
        ShowConfetti: false
    }),
    components: { ZoomableImage, ChatView, Confetti },

    computed: {
        currentURL() {
            return `./comics/${this.$store.getters.currentURL}`
        }
    },

    methods: {
        onNewMessage(message) {
            if (/#aniv13/i.test(message)) {
                this.ShowConfetti = true
                setTimeout(() => { this.ShowConfetti = false }, 5000)
            }
        },
        onSwipe(direction) {
            this.$router.push(this.path(this.page + (direction == 'left' ? 1 : -1)))
        },
        path(page) {
            return `/${page}${this.showInput ? '?input' : ''}`
        }
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch('goToPage', vm.page).catch(() => {
                vm.$router.push(vm.path(0))
            })
        })
    },

    beforeRouteUpdate(to, from, next) {
        const toPage = parseInt(to.params.page)
        const fromPage = parseInt(from.params.page)
        this.direction = toPage > fromPage ? 'left' : 'right'
        this.$store.dispatch('goToPage', toPage).then(() => { next() }).catch(() => { next(false) })
    },
}
</script>

<style lang="stylus">
.container {
    width: 100vw;
    height: calc(100% + 0px);
    display: flex;
    flex-direction: column;
}

.ZoomableImage {
    flex: 1;
}

.left-enter-active, .left-leave-active,
.fade-enter-active, .fade-leave-active,
.right-enter-active, .right-leave-active {
  transition: transform .2s cubic-bezier(.45,0,.21,1), opacity .2s cubic-bezier(.45,0,.21,1);
}
.left-enter, .left-leave-to,
.fade-enter, .fade-leave-to,
.right-enter, .right-leave-to {
  opacity: 0;
}

.left-enter, .left-leave-to {
  transform: translateX(-30%)
}
.right-enter, .right-leave-to {
  transform: translateX(30%)
}
</style>