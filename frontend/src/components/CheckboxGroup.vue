<template>
  <section>
    <ul class="checkbox-group">
      <li v-for="option in options" class="checkbox-item" :key="option.value" @click="toggleSelection(option.value)">
        <input
          type="checkbox"
          :id="`checkbox-${option.value}`"
          :value="option.value"
          :checked="isSelected(option.value)"
        />
        <label :for="`checkbox-${option.value}`" @click.prevent
          >{{ option.label }} <span class="checkbox-count">({{ option.count }})</span></label
        >
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "CheckboxGroup",
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    modelValue: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  methods: {
    isSelected(optionValue) {
      return this.modelValue.includes(optionValue);
    },
    toggleSelection(optionValue) {
      const newSelection = [...this.modelValue];
      const index = newSelection.indexOf(optionValue);

      const canAddToSelection = index === -1;
      if (canAddToSelection) {
        newSelection.push(optionValue);
      } else {
        newSelection.splice(index, 1);
      }
      this.$emit("update:modelValue", newSelection);
    },
  },
};
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-xs) 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checkbox-item input[type="checkbox"] {
  /* Remove default checkbox styling */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  position: relative;
  margin: 0;
  width: 26px;
  height: 26px;
  background-color: transparent;
  border: 4px solid var(--color-disabled);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.checkbox-item:hover input[type="checkbox"] {
  border-color: var(--color-primary);
}

.checkbox-item input[type="checkbox"]:checked {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}

.checkbox-item input[type="checkbox"]:checked:hover {
  border-color: var(--color-primary-hover);
  background-color: var(--color-primary-hover);
}

.checkbox-item input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;

  width: 0.4em;
  height: 0.7em;
  border: solid var(--color-background);
  border-width: 0 4px 4px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}

.checkbox-item label {
  color: var(--color-text-primary);
  font-size: var(--font-size-small);
  cursor: pointer;
  user-select: none;
}

.checkbox-item label .checkbox-count {
  color: var(--color-text-secondary);
  font-weight: normal;
}
</style>
