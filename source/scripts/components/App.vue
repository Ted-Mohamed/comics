<template>
    <div ref="container"
         class="container">
        <div class="message">
            {{lastMessage}}</div>
        <div ref="current"
             class="page">
            <img ref="image"
                 :src="currentURL">
        </div>
    </div>
</template>

<script>
import Hammer from 'hammerjs'
import { database } from '../includes/firebase.js'
const messages = database.ref('messages').limitToLast(1)

export default {
    name: "App",
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
        const HM = new Hammer.Manager(this.$refs.container)


        const swipe = new Hammer.Swipe({
            direction: Hammer.DIRECTION_HORIZONTAL,
        })
        const pinch = new Hammer.Pinch()
        const pan = new Hammer.Pan()

        pinch.recognizeWith(pan);

        HM.add([pinch, pan, swipe]);

        HM.on('swipeleft swiperight', (e) => {
            this.onSwipe(e.type == 'swipeleft' ? 'left' : 'right')
        })

        var adjustScale = 1;
        var adjustDeltaX = 0;
        var adjustDeltaY = 0;

        var currentScale = null;
        var currentDeltaX = null;
        var currentDeltaY = null;

        HM.on("pinch pan", (e) => {
            currentScale = adjustScale * 2;
            currentDeltaX = adjustDeltaX + (e.deltaX / currentScale);
            currentDeltaY = adjustDeltaY + (e.deltaY / currentScale);
            this.$refs.image.style.transform = `scale(${currentScale}) translate(${currentDeltaX}px,${currentDeltaY}px)`
        });


        HM.on("panend pinchend", (e) => {
            const imgDimen = this.$refs.image.getBoundingClientRect();
            console.log(imgDimen.top + imgDimen.height, window.innerHeight)
            console.log(currentScale, currentDeltaX, currentDeltaY)
            if (currentScale > 1) {
                adjustScale = currentScale;
                adjustDeltaX = currentDeltaX;
                adjustDeltaY = currentDeltaY;
            } else {
                adjustScale = 1;
                adjustDeltaX = 0;
                adjustDeltaY = 0;
            }
            this.$refs.image.style.transform = `scale(${adjustScale}) translate(${adjustDeltaX}px,${adjustDeltaY}px)`
        });





        messages.on('value', snapshot => {
            snapshot.forEach((m) => {
                this.lastMessage = m.val()
            })
        })
    }
}
</script>

<style lang="stylus">
.container {
    width: 100vw;
    backface-visibility: hidden;
    .c {
        top: 50px
    }
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
    background: url('./assets/comics/2/09/01.jpg');
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