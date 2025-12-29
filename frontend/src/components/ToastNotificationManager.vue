<template>
  <section class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :ref="`toast-${toast.id}`"
      class="toast-item"
      :class="{ 'fade-out': toast.isLeaving }"
      :style="getToastStyle(toast.index)"
    >
      <ToastMessage :message="toast.message" :type="toast.type" />
    </div>
  </section>
</template>

<script>
import ToastMessage from "@/components/ToastMessage.vue";

export default {
  name: "ToastNotificationManager",
  components: {
    ToastMessage,
  },
  data() {
    return {
      toasts: [],
      pageWidth: window.innerWidth,
      toastIdCounter: 0,
      autoRemoveIntervalInMilliseconds: 3000,
      fadeOutAnimationDurationInMilliseconds: 300, // Must match the CSS animation duration
      baseTopOffset: 32,
      minToastSpacing: 8,
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    showToast(data) {
      if (this.dataIsEmpty(data)) {
        return;
      }

      const toast = {
        id: this.toastIdCounter++,
        message: data.message,
        type: data.type,
        index: this.toasts.length,
        isLeaving: false,
      };
      this.toasts.push(toast);
      this.$nextTick(() => {
        this.updateToastPositions();
      });

      setTimeout(() => {
        this.removeToast(toast.id);
      }, this.autoRemoveIntervalInMilliseconds);
    },
    dataIsEmpty(data) {
      if (data == null) return true;
      if (typeof data === "object" && Object.keys(data).length === 0) return true;
      return data.message == null || data.type == null;
    },
    removeToast(toastId) {
      const toastToRemove = this.toasts.find((toast) => toast.id === toastId);
      if (toastToRemove) {
        toastToRemove.isLeaving = true;

        setTimeout(() => {
          const index = this.toasts.findIndex((toast) => toast.id === toastId);
          if (index > -1) {
            this.toasts.splice(index, 1);
            this.toasts.forEach((toast, idx) => {
              toast.index = idx;
            });
            this.$nextTick(() => {
              this.updateToastPositions();
            });
          }
        }, this.fadeOutAnimationDurationInMilliseconds);
      }
    },
    getToastStyle(index) {
      const toast = this.toasts[index];
      const hasCalculatedTop = toast && toast.calculatedTop !== undefined;
      const topValue = hasCalculatedTop ? `${toast.calculatedTop}px` : `${this.baseTopOffset + index * 70}px`;

      return {
        top: topValue,
      };
    },
    updateToastPositions() {
      let currentTop = this.baseTopOffset;

      this.toasts.forEach((toast) => {
        toast.calculatedTop = currentTop;

        const toastElementArray = this.$refs[`toast-${toast.id}`];
        const toastElement = Array.isArray(toastElementArray) ? toastElementArray[0] : null;
        if (toastElement) {
          const toastHeight = toastElement.offsetHeight;
          currentTop += toastHeight + this.minToastSpacing;
        }
      });
    },
    handleResize() {
      this.pageWidth = window.innerWidth;
      if (this.pageWidth < 768) {
        this.baseTopOffset = 16;
      } else if (this.pageWidth < 1100) {
        this.baseTopOffset = 24;
      } else {
        this.baseTopOffset = 32;
      }
    },
  },
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.toast-item {
  position: absolute;
  right: var(--gap-lg);
  animation: slideIn 0.3s ease-out;
  pointer-events: auto;
}

.toast-item.fade-out {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media screen and (max-width: 1100px) {
  .toast-item {
    right: var(--gap-md);
  }
}

@media screen and (max-width: 768px) {
  .toast-item {
    right: var(--gap-sm);
  }
}

@media screen and (max-width: 576px) {
  .toast-container {
    left: 0;
    right: 0;
  }
  .toast-item {
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>
