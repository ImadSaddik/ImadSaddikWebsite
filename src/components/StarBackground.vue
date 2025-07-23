<template>
  <canvas id="star-bg"></canvas>
</template>

<script>
export default {
  name: "StarBackground",
  mounted() {
    const canvas = this.$el;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = -1;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";

    const numStars = 120;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
      });
    }

    function drawStars() {
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;
      }
      requestAnimationFrame(drawStars);
    }
    drawStars();

    window.addEventListener("resize", () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    });
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
