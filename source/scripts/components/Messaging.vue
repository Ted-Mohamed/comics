<template>
    <div ref="container"
         class="container">
        <input class="message"
               type="text"
               v-model="message"
               @keyup.enter="sendMessage">
        <div ref="current"
             class="page">
            <img :key="currentURL"
                 :src="currentURL">
        </div>
    </div>
</template>

<script>
import Hammer from 'hammerjs'
import Firebase from 'firebase'
const firebaseApp = Firebase.initializeApp({
    apiKey: "FIREBASE_API_KEY",
    authDomain: "AUTH_DOMAIN",
    databaseURL: "FIREBASE_DATABASE_URL",
    projectId: "FIREBASE_PROJECT_ID",
    storageBucket: "FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID"
})
const db = firebaseApp.database()
const messages = db.ref('messages')

export default {
    name: "App",
    computed: {
        currentURL() {
            return `./assets/comics/${this.$store.getters.currentURL}`
        }
    },
    data: () => ({
        message: ''
    }),

    methods: {
        onSwipe(direction) {
            this.$store.dispatch(direction == 'left' ? 'nextPage' : 'previousPage')
        },
        sendMessage() {
            console.log("hi")
            messages.push(this.message)
            this.message = ''
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
    width: 100vw;
    backface-visibility: hidden;
}

.animate {
    transition: transform .25s cubic-bezier(0.25, 0, 1, 1);
}

.page {
    width: 100%;
    backface-visibility: hidden;
    will-change: transform;
}

img {
    backface-visibility: hidden;
    pointer-events: none;
    width: 100%;
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
    z-index: 100;
}
</style>