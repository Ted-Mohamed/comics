<template>
    <div>
    
        <img :src="null"
             class="previous">
        <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight">
            <img :src="`./assets/comics/${currentURL}`"
                 class="current">
        </v-touch>
        <img :src="false"
             class="next">
    </div>
</template>

<script>
export default {
    name: "App",
    computed: {
        currentURL() {
            return this.$store.getters.currentURL
        }
    },
    methods: {
        onSwipeLeft() {
            this.$store.dispatch('nextPage')
        },
        onSwipeRight() {
             this.$store.dispatch('previousPage')
        }
    }
}
</script>

<style>
    img {
       pointer-events: none;
       width: 100%;
    }
</style>