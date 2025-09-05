<template>
  <section class="dropdown" ref="dropdownReference">
    <button class="dropdown-toggle" @click="toggleDropdown" :aria-expanded="isOpen" aria-haspopup="listbox">
      <span class="dropdown-label" :class="{ 'is-placeholder': selectedOption.value === null }">{{
        selectedOption.label
      }}</span>
      <i
        v-if="clearable && modelValue"
        class="fa-solid fa-times fa-lg dropdown-clear"
        role="button"
        aria-label="Clear selection"
        @click.stop="clearSelection"
      ></i>
      <i v-else class="fa-solid dropdown-arrow" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </button>

    <ul v-if="isOpen" class="dropdown-menu" role="listbox" aria-label="Options">
      <li
        v-for="option in options"
        role="option"
        tabindex="0"
        :key="option.value"
        :class="{ 'is-selected': option.value === modelValue }"
        :aria-selected="option.value === modelValue"
        @click="selectOption(option)"
        @keydown.enter="selectOption(option)"
        @keydown.space.prevent="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "DropDownMenu",
  emits: ["update:modelValue"],
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    modelValue: {
      type: [String, Number],
      default: null,
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedOption() {
      const defaultOption = { label: this.placeholder, value: null };
      const selectedOption = this.options.find((option) => option.value === this.modelValue);
      return selectedOption || defaultOption;
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.$emit("update:modelValue", option.value);
      this.isOpen = false;

      const reference = this.$refs.dropdownReference;
      const button = reference.querySelector("button");
      if (button) {
        button.focus();
      }
    },
    clearSelection() {
      this.$emit("update:modelValue", null);
    },
    handleClickOutside(event) {
      const reference = this.$refs.dropdownReference;
      if (reference && !reference.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
  watch: {
    isOpen(value) {
      if (value) {
        document.addEventListener("click", this.handleClickOutside, true);
      } else {
        document.removeEventListener("click", this.handleClickOutside, true);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--gap-sm);
  border: 4px solid var(--color-disabled);
  background: var(--color-background);
  color: var(--color-text-primary);
  text-align: left;
  font-size: var(--font-size-small);
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.dropdown-toggle:hover {
  border-color: var(--color-primary);
}

.dropdown-toggle:focus {
  border-color: var(--color-primary);
  outline: none;
}

.dropdown-arrow {
  color: var(--color-text-primary);
  transition: color 0.3s ease;
}

.dropdown-toggle:hover .dropdown-arrow,
.dropdown-toggle:focus .dropdown-arrow {
  color: var(--color-primary);
}

.dropdown-clear {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.dropdown-clear:hover {
  color: var(--color-primary);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-height: 200px;
  box-sizing: border-box;
  background-color: var(--color-background);
  border: 1px solid var(--color-disabled);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
  overflow-y: auto;
}

.dropdown-menu li {
  padding: var(--gap-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover,
.dropdown-menu li:focus {
  background-color: var(--color-primary-hover);
  outline: none;
}

.dropdown-menu li.is-selected {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.dropdown-label {
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
  margin-right: var(--gap-xs);
}

.dropdown-label.is-placeholder {
  color: var(--color-text-secondary);
}
</style>
