<template>
  <div class="search-bar">
    <i class="fa-solid fa-search search-icon"></i>
    <input
      class="search-input"
      type="text"
      :value="modelValue"
      :placeholder="placeHolder"
      @input="updateSearchQuery($event.target.value)"
      @keydown.enter="sendRequestToPerformSearch"
    />
    <div v-if="modelValue" class="search-actions">
      <i
        class="fa-solid fa-times fa-lg search-clear"
        aria-label="Clear search"
        role="button"
        title="Click to clear search"
        @click="clearSearch"
      ></i>
      <i
        class="fa-solid fa-paper-plane search-send"
        aria-label="Perform search"
        role="button"
        title="Click to search or press Enter"
        @click="sendRequestToPerformSearch"
      ></i>
    </div>
  </div>
  <p>To search, type your query and press Enter or click the search icon on the right.</p>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    placeHolder: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "perform-search"],
  data() {
    return {};
  },
  methods: {
    clearSearch() {
      this.$emit("update:modelValue", "");
      this.$emit("perform-search");
    },
    updateSearchQuery(searchQuery) {
      this.$emit("update:modelValue", searchQuery);
    },
    sendRequestToPerformSearch() {
      this.$emit("perform-search");
    },
  },
};
</script>

<style scoped>
p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-sm) 0;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  border: 4px solid var(--color-disabled);
  transition: border-color 0.3s ease;
}

.search-bar:hover {
  border-color: var(--color-primary);
}

.search-bar:focus-within {
  border-color: var(--color-primary);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-left: var(--gap-xs);
  color: var(--color-text-secondary);
}

.search-input {
  flex: 1;
  border: none;
  background: var(--color-background);
  padding: var(--gap-sm) var(--gap-xs);
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-actions {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: var(--gap-xs);
}

.search-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-send:hover {
  color: var(--color-primary);
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-clear:hover {
  color: var(--color-primary);
}
</style>
