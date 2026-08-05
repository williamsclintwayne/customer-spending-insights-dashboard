<script setup lang="ts">
import { storeToRefs } from 'pinia'

import type { SpendingCategory } from '@/types'
import { SPENDING_CATEGORIES, TIME_PERIODS } from '@/utils'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { selectedCategory } = storeToRefs(dashboardStore)

function handleCategoryChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value

  dashboardStore.setCategory(value === '' ? null : (value as SpendingCategory))
}

function applyTimePeriod(days: number | null): void {
  if (days === null) {
    return
  }

  const end = new Date()
  const start = new Date(end)

  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  dashboardStore.setDateRange(start, end)
}
</script>

<template>
  <section class="filter-bar" aria-labelledby="filter-heading">
    <div class="filter-bar__heading">
      <div>
        <h2 id="filter-heading">Filters</h2>
        <p>Refine all dashboard results.</p>
      </div>

      <button type="button" class="reset-button" @click="dashboardStore.resetFilters">
        Reset filters
      </button>
    </div>

    <div class="filter-bar__controls">
      <label class="category-filter">
        <span>Category</span>

        <select :value="selectedCategory ?? ''" @change="handleCategoryChange">
          <option value="">All categories</option>

          <option v-for="category in SPENDING_CATEGORIES" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <div class="quick-filters">
        <span>Quick period</span>

        <div class="quick-filters__buttons">
          <button
            v-for="period in TIME_PERIODS"
            :key="period.value"
            type="button"
            :disabled="period.days === null"
            @click="applyTimePeriod(period.days)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filter-bar {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.filter-bar__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

.filter-bar__heading p {
  margin: 5px 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.reset-button {
  padding: 8px 14px;
  color: var(--color-primary-dark);
  font-weight: 700;
  background: var(--color-primary-soft);
  border: 0;
  border-radius: 10px;
}

.filter-bar__controls {
  display: grid;
  gap: 18px;
}

.category-filter,
.quick-filters {
  display: grid;
  gap: 7px;
}

.category-filter span,
.quick-filters > span {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.category-filter select {
  width: 100%;
  padding: 10px 12px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.quick-filters__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-filters button {
  padding: 8px 14px;
  color: var(--color-text);
  background: #f8faf9;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.quick-filters button:hover:not(:disabled) {
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.quick-filters button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (min-width: 768px) {
  .filter-bar__controls {
    grid-template-columns: minmax(200px, 0.35fr) minmax(0, 1fr);
    align-items: end;
  }
}
</style>
