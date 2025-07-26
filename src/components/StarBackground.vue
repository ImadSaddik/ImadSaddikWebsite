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
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          r: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.15,
          dy: (Math.random() - 0.5) * 0.15,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    },
    drawStars() {
      this.context.clearRect(0, 0, this.width, this.height);
      for (const star of this.stars) {
        this.context.save();
        this.context.globalAlpha = star.alpha;
        this.context.beginPath();
        this.context.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        this.context.fillStyle = star.color;
        this.context.shadowColor = star.color;
        this.context.shadowBlur = 8;
        this.context.fill();
        this.context.restore();

        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0) star.x = this.width;
        if (star.x > this.width) star.x = 0;
        if (star.y < 0) star.y = this.height;
        if (star.y > this.height) star.y = 0;
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
