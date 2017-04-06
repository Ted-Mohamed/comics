<template>
    <div class="ZoomableImage"
         :class="{loading}"
         ref="container">
        <div class="loader">
            <svg version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 50 50"
                 style="enable-background:new 0 0 50 50;"
                 xml:space="preserve">
                <path fill="#000"
                      d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="xml"
                                      attributeName="transform"
                                      type="rotate"
                                      from="0 25 25"
                                      to="360 25 25"
                                      dur="0.6s"
                                      repeatCount="indefinite" />
                </path>
            </svg>
        </div>
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
    data: () => ({
        loading: true
    }),
    mounted() {
        this.$refs.image.onload = () => { this.loading = false }
        const HM = new Hammer.Manager(this.$refs.container)

        const swipe = new Hammer.Swipe({
            direction: Hammer.DIRECTION_HORIZONTAL,
            enable: (rec, input) => {
                return adjustScale === 1
            }
        })
        const pinch = new Hammer.Pinch()
        const pan = new Hammer.Pan({
            enable: (rec, input) => {
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
.ZoomableImage  {
    overflow: hidden;
    position: relative;
    z-index: 5
    .animate {
        transition: transform .2s cubic-bezier(.45,0,.21,1);
    }
    &.loading {
        pointer-events: none;
        img {
            opacity: 0
        }
        .loader {
            display: block;
            position: absolute;
            content: '';
            width: 50px;
            height: 50px;  
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
        }
    }
    img {
        position: relative;
        backface-visibility: hidden;
        pointer-events: none;
        width: 100%;
        transform-origin: 0 0;
        will-change: transform;
        z-index: 5;
        opacity: 1;
        transition: opacity .2s cubic-bezier(.45,0,.21,1);
    }

    .loader {
        display: none;
        svg {
            width: 100%;
            height: 100%;
            path {
                fill: $highlight-color;
            }
        }
    }
}
</style>