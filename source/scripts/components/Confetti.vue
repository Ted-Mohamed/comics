<template>
    <canvas class="Confetti"
            ref="canvas">
    </canvas>
</template>

<script>
const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548'
]

class Particle {
    constructor(width, height) {
        this.x = width / 2
        this.y = height / 2
        this.boxW = randomRange(5, 20)
        this.boxH = randomRange(5, 20)
        this.size = randomRange(2, 8)
        this.spikeran = randomRange(3, 5)
        this.velX = randomRange(-8, 8)
        this.velY = randomRange(-50, -10)
        this.angle = convertToRadians(randomRange(0, 360))
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.anglespin = randomRange(-0.2, 0.2)
    }

    draw(context, width, height) {
        context.save()
        context.translate(this.x, this.y)
        context.rotate(this.angle)
        context.fillStyle = this.color
        context.beginPath()
        context.fillRect(this.boxW / 2 * -1, this.boxH / 2 * -1, this.boxW, this.boxH)
        context.fill()
        context.closePath()
        context.restore()
        this.angle += this.anglespin
        this.velY *= 0.999
        this.velY += 0.3
        this.x += this.velX
        this.y += this.velY
        if (this.y < 0) {
            this.velY *= -0.2
            this.velX *= 0.9
        }
        if (this.y > height) {
            this.anglespin = 0
            this.y = height
            this.velY *= -0.2
            this.velX *= 0.9
        }
        if (this.x > width || this.x < 0) {
            this.velX *= -0.5
        }
    }
}


function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function convertToRadians(degree) {
    return degree * (Math.PI / 180);
}


export default {
    name: 'Confetti',
    methods: {

    },

    mounted() {
        const context = this.$refs.canvas.getContext("2d");
        const width = this.$refs.canvas.width = window.innerWidth;
        const height = this.$refs.canvas.height = window.innerHeight;

        const font = "20pt sans-serif"
        let particles = []
        let particleCount = 0
        let gravity = 0.3

        for (var i = 0; i < 300; i++) {
            particles.push(new Particle(width, height));
        }

        function update() {
            context.clearRect(0, 0, width, height)
            context.font = font
            context.fillText("Happy 13 Months Honey!!!", width / 2, 150)
            context.textAlign = 'center'
            context.globalAlpha = 1;

            for (var i = 0; i < particles.length; i++) {
                particles[i].draw(context, width, height);
            }

            requestAnimationFrame(update);
        }

        update();
    }
}
</script>

<style lang="stylus">
    .Confetti {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0; 
        right: 0;
        z-index: 1000;
        background: #fff
    }
</style>