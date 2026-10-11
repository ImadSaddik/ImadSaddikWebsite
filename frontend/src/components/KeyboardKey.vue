<template>
  <kbd v-if="keys.length <= 1" class="keyboard-key">{{ keys[0] || text }}</kbd>
  <kbd v-else class="keyboard-shortcut">
    <template v-for="(key, index) in keys" :key="index">
      <kbd class="keyboard-key">{{ key }}</kbd>
      <span v-if="index < keys.length - 1" class="keyboard-separator">+</span>
    </template>
  </kbd>
</template>

<script>
export default {
  name: "KeyboardKey",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    keys() {
      if (!this.text) {
        return [];
      }

      if (this.text === "+") {
        return ["+"];
      }

      const parts = this.text
        .split("+")
        .map((part) => part.trim())
        .filter(Boolean);

      return parts.length > 0 ? parts : [this.text];
    },
  },
};
</script>

<style scoped>
kbd.keyboard-shortcut {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  vertical-align: middle;
}

.keyboard-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  height: 1.6em;
  padding: 0 0.4em;
  font-family: var(--font-family-mono);
  font-size: 0.85em;
  font-weight: 600;
  line-height: 1;
  color: var(--color-text-primary);
  background: linear-gradient(180deg, #28334a 0%, #192132 100%);
  border: 1px solid #374151;
  border-radius: 4px;
  box-shadow: inset 0 -2px 0 0 rgba(0, 0, 0, 1);
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;
}

.keyboard-separator {
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
  font-size: 0.85em;
  font-weight: 700;
  user-select: none;
}
</style>
