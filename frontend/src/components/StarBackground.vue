<template>
  <canvas id="star-bg"></canvas>
</template>

<script>
import {
  STAR_COLORS,
  DEFAULT_NUM_STARS,
  STAR_RADIUS_MIN,
  STAR_RADIUS_RANGE,
  STAR_ALPHA_MIN,
  STAR_ALPHA_RANGE,
  STAR_STEP_SIZE_RANGE,
  STAR_SPIKE_CHANCE,
  STAR_SPIKE_NUM,
  STAR_SPIKE_LENGTH_MULTIPLIER,
  STAR_SPIKE_LENGTH_RANDOM,
  STAR_SPIKE_WIDTH_MIN,
  STAR_SPIKE_WIDTH_MULTIPLIER,
  STAR_SPIKE_SHADOW_BLUR,
  STAR_SPIKE_ALPHA_MULTIPLIER,
  STAR_SHADOW_BLUR,
} from "@/constants.js";

export default {
  name: "StarBackground",
  data() {
    return {
      stars: [],
      numStars: DEFAULT_NUM_STARS,
      width: window.innerWidth,
      height: window.innerHeight,
      context: null,
      animationFrameId: null,
    };
  },
  methods: {
    initStars() {
      this.stars = [];
      for (let i = 0; i < this.numStars; i++) {
        this.stars.push({
          positionX: Math.random() * this.width,
          positionY: Math.random() * this.height,
          radius: Math.random() * STAR_RADIUS_RANGE + STAR_RADIUS_MIN,
          alpha: Math.random() * STAR_ALPHA_RANGE + STAR_ALPHA_MIN,
          stepSizeX: (Math.random() - 0.5) * STAR_STEP_SIZE_RANGE,
          stepSizeY: (Math.random() - 0.5) * STAR_STEP_SIZE_RANGE,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          hasSpikes: Math.random() < STAR_SPIKE_CHANCE,
        });
      }
    },
    drawStars() {
      this.context.clearRect(0, 0, this.width, this.height);
      for (const star of this.stars) {
        this.context.save();
        this.context.globalAlpha = star.alpha;
        if (star.hasSpikes) {
          this.drawJWSTDiffractionSpikes(star);
        }
        this.drawStarCircle(star);

        star.positionX += star.stepSizeX;
        star.positionY += star.stepSizeY;
        this.handleStarOutOfBounds(star);
      }
      this.animationFrameId = requestAnimationFrame(this.drawStars);
    },
    drawJWSTDiffractionSpikes(star) {
      for (let i = 0; i < STAR_SPIKE_NUM; i++) {
        const angle = (i * Math.PI) / (STAR_SPIKE_NUM / 2);
        this.context.save();
        this.context.translate(star.positionX, star.positionY);
        this.context.rotate(angle);
        this.context.beginPath();
        this.context.moveTo(0, 0);
        const spikeLength = star.radius * STAR_SPIKE_LENGTH_MULTIPLIER + Math.random() * STAR_SPIKE_LENGTH_RANDOM;
        const spikeWidth = Math.max(STAR_SPIKE_WIDTH_MIN, star.radius * STAR_SPIKE_WIDTH_MULTIPLIER);
        this.context.lineTo(0, -spikeLength);
        this.context.strokeStyle = star.color;
        this.context.shadowColor = star.color;
        this.context.shadowBlur = STAR_SPIKE_SHADOW_BLUR;
        this.context.lineWidth = spikeWidth;
        this.context.globalAlpha = star.alpha * STAR_SPIKE_ALPHA_MULTIPLIER;
        this.context.stroke();
        this.context.restore();
      }
    },
    drawStarCircle(star) {
      this.context.beginPath();
      this.context.arc(star.positionX, star.positionY, star.radius, 0, 2 * Math.PI);
      this.context.fillStyle = star.color;
      this.context.shadowColor = star.color;
      this.context.shadowBlur = STAR_SHADOW_BLUR;
      this.context.globalAlpha = star.alpha;
      this.context.fill();
      this.context.restore();
    },
    handleStarOutOfBounds(star) {
      if (star.positionX < 0) star.positionX = this.width;
      if (star.positionX > this.width) star.positionX = 0;
      if (star.positionY < 0) star.positionY = this.height;
      if (star.positionY > this.height) star.positionY = 0;
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
