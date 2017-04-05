<template>
    <div class="ZoomableImage"
         ref="container">
        <img ref="image"
             :src="src">
    </div>
</template>

<script>
import Hammer from 'hammerjs'
import { clamp, transitionOnceWithClass } from '../includes/utility.js'
export default {
    name: "ZoomableImage",
    props: ['src'],
    mounted() {
        const HM = new Hammer.Manager(this.$refs.container)

        const swipe = new Hammer.Swipe({
            direction: Hammer.DIRECTION_HORIZONTAL,
            enable: function (rec, input) {
                return adjustScale === 1
            }
        })
        const pinch = new Hammer.Pinch()
        const pan = new Hammer.Pan({
            enable: function (rec, input) {
                return adjustScale !== 1 || (input && input.offsetDirection & Hammer.DIRECTION_VERTICAL)
            }
        })

        pinch.recognizeWith(pan);
        pinch.recognizeWith(swipe);
        swipe.recognizeWith(pan);
        HM.add([pinch, pan, swipe]);

        HM.on('swipeleft swiperight', (e) => {
            this.$emit('swipe', e.type == 'swipeleft' ? 'left' : 'right')
        })

        var adjustScale = 1
        var adjustDeltaX = 0
        var adjustDeltaY = 0

        var currentScale = null
        var currentDeltaX = null
        var currentDeltaY = null

        HM.on("pinch pan", (e) => {
            requestAnimationFrame(() => {
                currentScale = adjustScale * e.scale;
                currentDeltaX = currentScale > 1 ? adjustDeltaX + (e.deltaX / currentScale) : 0;
                currentDeltaY = adjustDeltaY + (e.deltaY / currentScale);
                this.$refs.image.style.transform = `scale(${currentScale}) translate(${currentDeltaX}px,${currentDeltaY}px)`
            })
        })

        HM.on("panend pinchend", (e) => {
            requestAnimationFrame(() => {
                const imageRect = this.$refs.image.getBoundingClientRect();
                const containerRect = this.$refs.container.getBoundingClientRect();
                adjustScale = clamp(currentScale, 1, 3)
                adjustDeltaX = clamp(currentDeltaX, (containerRect.width - imageRect.width) / adjustScale, 0)
                adjustDeltaY = clamp(currentDeltaY, (containerRect.height - imageRect.height) / adjustScale, 0)
                transitionOnceWithClass(this.$refs.image, 'animate')
                this.$refs.image.style.transform = `scale(${adjustScale}) translate(${adjustDeltaX}px,${adjustDeltaY}px)`
            })
        })
    }
}

</script>
<style lang="stylus">
ZoomableImage .animate {
    transition: transform .1s ease-in-out;
}
.ZoomableImage {
    overflow: hidden;
    position: relative;
    z-index: 5
}
.ZoomableImage img {
    position: relative;
    backface-visibility: hidden;
    pointer-events: none;
    width: 100%;
    transform-origin: 0 0;
    will-change: transform;
    z-index: 5
}
</style>