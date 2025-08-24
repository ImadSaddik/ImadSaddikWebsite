<template>
  <section :class="toastClass">
    <i :class="toastIcon" class="toast-icon"></i>
    <span class="toast-text">{{ message }}</span>
  </section>
</template>

<script>
export default {
  name: "ToastMessage",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    toastClass() {
      return `toast-message toast-${this.type}`;
    },
    toastIcon() {
      const iconMap = {
        success: "fa-solid fa-check-circle",
        error: "fa-solid fa-exclamation-circle",
        warning: "fa-solid fa-exclamation-triangle",
        info: "fa-solid fa-info-circle",
      };
      return iconMap[this.type];
    },
  },
};
</script>

<style scoped>
.toast-message {
  display: flex;
  align-items: center;
  padding: var(--gap-sm);
  gap: var(--gap-sm);
  font-size: var(--font-size-small);
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  min-width: 280px;
  max-width: 400px;
}

.toast-success {
  background-color: var(--color-toast-success-background);
  color: var(--color-toast-success-foreground);
}

.toast-error {
  background-color: var(--color-toast-error-background);
  color: var(--color-toast-error-foreground);
}

.toast-warning {
  background-color: var(--color-toast-warning-background);
  color: var(--color-toast-warning-foreground);
}

.toast-info {
  background-color: var(--color-toast-info-background);
  color: var(--color-toast-info-foreground);
}

.toast-icon {
  font-size: var(--font-size-small);
  flex-shrink: 0;
}

.toast-text {
  flex: 1;
  line-height: 1.4;
}

@media screen and (max-width: 576px) {
  .toast-message {
    width: 100%;
    max-width: none;
    min-width: 0;
  }
}
</style>
