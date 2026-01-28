<template>
  <div class="table-container">
    <table class="custom-table" :style="tableStyle">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    headers: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    textAlign: {
      type: String,
      default: "left",
      validator: (value) => ["left", "center", "right"].includes(value),
    },
  },
  computed: {
    tableStyle() {
      return {
        textAlign: this.textAlign,
      };
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  margin: var(--gap-md) 0;
  border: 1px solid var(--color-table-outside-border);
}

.custom-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

.custom-table th,
.custom-table td {
  padding: var(--gap-sm) var(--gap-sm);
  border-bottom: 1px solid var(--color-table-inside-border);
}

.custom-table thead tr {
  background-color: var(--color-table-header-background);
}

.custom-table th {
  font-weight: bold;
  color: var(--color-text-primary);
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}
</style>
