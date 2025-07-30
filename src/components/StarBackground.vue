<template>
  <canvas id="star-bg"></canvas>
</template>

<script>
export default {
  name: "StarBackground",
  data() {
    return {
      stars: [],
      numStars: 120,
      width: window.innerWidth,
      height: window.innerHeight,
      context: null,
      animationFrameId: null,
    };
  },
  methods: {
    initStars() {
      const starColors = [
        "#ffffff", // White
        "#ffe9c4", // Pale yellow
        "#b5d0ff", // Blue-white
        "#f7f7a8", // Yellowish
        "#c4e1ff", // Light blue
        "#ffd700", // Gold
        "#ffb347", // Orange
      ];
      this.stars = [];
      for (let i = 0; i < this.numStars; i++) {
        this.stars.push({
          positionX: Math.random() * this.width,
          positionY: Math.random() * this.height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.5 + 0.3,
          stepSizeX: (Math.random() - 0.5) * 0.15,
          stepSizeY: (Math.random() - 0.5) * 0.15,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          hasSpikes: Math.random() < 0.1,
        });
      }
    },
    drawStars() {
      this.context.clearRect(0, 0, this.width, this.height);
      for (const star of this.stars) {
        this.context.save();
        this.context.globalAlpha = star.alpha;
        if (star.hasSpikes) {
          // Draw diffraction spikes (JWST style)
          const numSpikes = 6;
          const spikeLength = star.radius * 3 + Math.random() * 2;
          const spikeWidth = Math.max(0.5, star.radius * 0.5);
          for (let i = 0; i < numSpikes; i++) {
            const angle = (i * Math.PI) / (numSpikes / 2);
            this.context.save();
            this.context.translate(star.positionX, star.positionY);
            this.context.rotate(angle);
            this.context.beginPath();
            this.context.moveTo(0, 0);
            this.context.lineTo(0, -spikeLength);
            this.context.strokeStyle = star.color;
            this.context.shadowColor = star.color;
            this.context.shadowBlur = 8;
            this.context.lineWidth = spikeWidth;
            this.context.globalAlpha = star.alpha * 0.7;
            this.context.stroke();
            this.context.restore();
          }
        }
        // Draw the star circle
        this.context.beginPath();
        this.context.arc(star.positionX, star.positionY, star.radius, 0, 2 * Math.PI);
        this.context.fillStyle = star.color;
        this.context.shadowColor = star.color;
        this.context.shadowBlur = 8;
        this.context.globalAlpha = star.alpha;
        this.context.fill();
        this.context.restore();

        star.positionX += star.stepSizeX;
        star.positionY += star.stepSizeY;
        if (star.positionX < 0) star.positionX = this.width;
        if (star.positionX > this.width) star.positionX = 0;
        if (star.positionY < 0) star.positionY = this.height;
        if (star.positionY > this.height) star.positionY = 0;
      }
      this.animationFrameId = requestAnimationFrame(this.drawStars);
    },
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      const canvas = this.$el;
      canvas.width = this.width;
      canvas.height = this.height;
      this.initStars();
    },
    setupCanvas() {
      const canvas = this.$el;
      this.context = canvas.getContext("2d");
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.style.position = "fixed";
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.zIndex = -1;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
    },
  },
  mounted() {
    this.setupCanvas();
    this.initStars();
    this.drawStars();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    cancelAnimationFrame(this.animationFrameId);
  },
};
</script>

<style scoped>
#star-bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
