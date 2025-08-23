<template>
  <canvas id="meteor-canvas"></canvas>
</template>

<script>
export default {
  name: "MeteorShowers",
  data() {
    return {
      context: null,
      width: window.innerWidth,
      height: window.innerHeight,
      meteors: [],
      radiant: null,
      animationFrameId: null,
      meteorTimeoutId: null,
    };
  },
  methods: {
    spawnMeteor() {
      const spawnZoneWidth = this.width * 0.2;
      const spawnZoneOffset = (this.width - spawnZoneWidth) / 2;

      // A random starting point along the top edge of the screen
      const startX = Math.random() * spawnZoneWidth + spawnZoneOffset;
      const startY = 0;

      // Calculate the angle from the radiant to the start point.
      // This makes all meteors travel in a similar direction.
      const angle = Math.atan2(startY - this.radiant.y, startX - this.radiant.x);

      // Add more variety to each meteor's appearance
      const speed = Math.random() * 7 + 6;
      const length = Math.random() * 150 + 70;
      const lineWidth = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.6 + 0.4;

      this.meteors.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        lineWidth,
        opacity,
      });
    },
    drawMeteors() {
      this.context.clearRect(0, 0, this.width, this.height);
      const tailScale = 20;
      const meteorFadingFactor = 0.01;
      for (let i = this.meteors.length - 1; i >= 0; i--) {
        const meteor = this.meteors[i];

        const headX = meteor.x;
        const headY = meteor.y;
        const tailX = meteor.x - meteor.dx * (meteor.length / tailScale);
        const tailY = meteor.y - meteor.dy * (meteor.length / tailScale);

        const gradient = this.context.createLinearGradient(headX, headY, tailX, tailY);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.context.save();
        this.context.globalAlpha = meteor.opacity;
        this.context.strokeStyle = gradient;
        this.context.lineWidth = meteor.lineWidth;
        this.context.lineCap = "round";
        this.context.beginPath();
        this.context.moveTo(headX, headY);
        this.context.lineTo(tailX, tailY);
        this.context.stroke();
        this.context.restore();

        meteor.x += meteor.dx;
        meteor.y += meteor.dy;
        meteor.opacity -= meteorFadingFactor;

        const isFadedOut = meteor.opacity <= 0;
        const isOffRight = meteor.x > this.width + 100;
        const isOffBottom = meteor.y > this.height + 100;

        if (isFadedOut || isOffRight || isOffBottom) {
          this.meteors.splice(i, 1);
        }
      }
      this.animationFrameId = requestAnimationFrame(this.drawMeteors);
    },
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.radiant.x = this.width / 2;

      const canvas = this.$el;
      canvas.width = this.width;
      canvas.height = this.height;
    },
    setupCanvas() {
      const canvas = this.$el;
      this.context = canvas.getContext("2d");
      canvas.width = this.width;
      canvas.height = this.height;
    },
    scheduleNextMeteor() {
      const burstChance = 0.2;
      const minBurstCount = 2;
      const maxBurstCount = 5;
      const maxBurstDelayMs = 800;
      const minPauseMs = 30000;
      const maxPauseMs = 60000;

      this.meteorTimeoutId = setTimeout(
        () => {
          if (Math.random() < burstChance) {
            const burstCount = Math.floor(Math.random() * (maxBurstCount - minBurstCount + 1)) + minBurstCount;
            for (let i = 0; i < burstCount; i++) {
              setTimeout(() => this.spawnMeteor(), Math.random() * maxBurstDelayMs);
            }
          } else {
            this.spawnMeteor();
          }

          this.scheduleNextMeteor();
        },
        Math.random() < 0.5 ? minPauseMs : maxPauseMs
      );
    },
  },
  mounted() {
    this.radiant = { x: this.width / 2, y: -50 };
    this.setupCanvas();
    this.drawMeteors();
    this.scheduleNextMeteor();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.meteorTimeoutId);
  },
};
</script>

<style scoped>
#meteor-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
