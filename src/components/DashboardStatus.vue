<script setup lang="ts">
interface Props {
  isLoading: boolean
  errorMessage: string | null
  isEmpty: boolean
}

defineProps<Props>()

defineEmits<{
  retry: []
  resetFilters: []
}>()
</script>

<template>
  <section v-if="isLoading" class="status-card" role="status" aria-live="polite">
    <div class="spinner" aria-hidden="true"></div>

    <div>
      <h2>Loading spending data</h2>
      <p>Please wait while the latest transaction information is prepared.</p>
    </div>
  </section>

  <section v-else-if="errorMessage" class="status-card status-card--error" role="alert">
    <div>
      <h2>Unable to load the dashboard</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <button type="button" @click="$emit('retry')">Try again</button>
  </section>

  <section v-else-if="isEmpty" class="status-card">
    <div>
      <h2>No transactions found</h2>
      <p>No spending data matches the selected filters and date range.</p>
    </div>

    <button type="button" @click="$emit('resetFilters')">Reset filters</button>
  </section>
</template>

<style scoped>
.status-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding: 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.status-card--error {
  background: var(--color-danger-soft);
  border-color: rgb(180 35 24 / 25%);
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

p {
  margin: 8px 0 0;
  color: var(--color-text-muted);
}

button {
  padding: 10px 16px;
  color: #ffffff;
  font-weight: 700;
  background: var(--color-primary);
  border: 0;
  border-radius: 10px;
}

button:hover {
  background: var(--color-primary-dark);
}

.spinner {
  width: 34px;
  height: 34px;
  border: 4px solid var(--color-primary-soft);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 768px) {
  .status-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
