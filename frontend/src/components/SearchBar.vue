<template>
  <div class="search-bar">
    <i class="fas fa-search search-icon"></i>
    <input
      class="search-input"
      type="text"
      v-model="searchQuery"
      :placeholder="placeHolder"
      @keydown.enter="handleSearchRequest"
    />
    <i
      v-if="searchQuery"
      class="fas fa-times fa-lg search-clear"
      @click="clearSearch"
      aria-label="Clear search"
      role="button"
    ></i>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  emits: ["search-request"],
  props: {
    placeHolder: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    clearSearch() {
      this.searchQuery = "";
    },
    handleSearchRequest() {
      this.$emit("search-request", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: var(--gap-sm);
  color: var(--color-text-secondary);
  z-index: 1;
}

.search-input {
  width: 100%;
  background: var(--color-background);
  border: 4px solid var(--color-disabled);
  padding: var(--gap-sm) var(--gap-xl);
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.search-input:hover {
  border-color: var(--color-primary);
}

.search-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-clear {
  position: absolute;
  right: var(--gap-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  z-index: 1;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-clear:hover {
  color: var(--color-primary);
}
</style>
