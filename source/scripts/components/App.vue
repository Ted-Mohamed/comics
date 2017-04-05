<template>
    <div ref="container"
         class="container">
        <div class="message">
            {{lastMessage}}</div>
        <ZoomableImage @swipe="onSwipe"
                       :src="currentURL"></ZoomableImage>
    </div>
</template>

<script>
import ZoomableImage from './ZoomableImage.vue'
import { database } from '../includes/firebase.js'
const messages = database.ref('messages').limitToLast(1)
export default {
    name: "App",
    components: {
        ZoomableImage
    },
    computed: {
        currentURL() {
            return `./assets/comics/${this.$store.getters.currentURL}`
        }
    },
    data: () => ({
        lastMessage: '...'
    }),

    methods: {
        onSwipe(direction) {
            this.$store.dispatch(direction == 'left' ? 'nextPage' : 'previousPage')
        }
    },
    mounted() {
        messages.on('value', snapshot => {
            snapshot.forEach((m) => {
                this.lastMessage = m.val()
            })
        })
    }
}
</script>

<style lang="stylus">
html, body {
    height: 100%;
}
.container {
    width: 100vw;
    height: calc(100% - 0px);
    display: flex;
    flex-direction: column
}

.ZoomableImage {
    flex: 1;
}

.message {
    background: #000;
    width: 100%;
    font-size: 30px;
    color: #fff;
    padding: 20px;
    position: sticky;
    top: 0;
    display: block;
    position: relative;
    z-index: 100;
}
</style>