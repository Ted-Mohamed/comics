<template>
    <div class="container">
        <ChatView showInput></ChatView>
        <ZoomableImage @swipe="onSwipe"
                       :src="currentURL"></ZoomableImage>
    </div>
</template>

<script>
import ZoomableImage from './ZoomableImage.vue'
import ChatView from './ChatView.vue'
export default {
    name: "App",

    components: { ZoomableImage, ChatView },

    computed: {
        currentURL() {
            return `./assets/comics/${this.$store.getters.currentURL}`
        }
    },

    methods: {
        onSwipe(direction) {
            this.$store.dispatch(direction == 'left' ? 'nextPage' : 'previousPage')
        }
    },
}
</script>

<style lang="stylus">
.container {
    width: 100vw;
    height: calc(100% - 0px);
    display: flex;
    flex-direction: column
}

.ZoomableImage {
    flex: 1;
}
</style>