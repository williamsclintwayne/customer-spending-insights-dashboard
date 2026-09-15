<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { spendingCategories } from '@/types'
import { SPENDING_CATEGORIES, TIME_PERIODS, type TimePeriodOption } from '@/utils'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { selectedCategory, selectedTimePeriod } = storeToRefs(dashboardStore)

function handleCategoryChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value

  if (value === '') {
    dashboardStore.setCategory(null)
    return
  }

  const category = spendingCategories.find((c) => c === value)
  if (category !== undefined) {
    dashboardStore.setCategory(category)
  }
}

function applyTimePeriod(period: TimePeriodOption): void {
  if (period.days === null) {
    dashboardStore.setTimePeriod(period.value)
    return
  }

  const end = new Date()
  const start = new Date(end)

  start.setDate(start.getDate() - (period.days - 1))

  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  dashboardStore.setDateRange(start, end, period.value)
}
</script>

<template>
  <section class="filter-bar" aria-label="Dashboard filters">
    <div class="filter-bar__heading">
      <h2 id="filter-heading">Filters</h2>
      <p>Refine all dashboard results.</p>
    </div>

    <div class="filter-bar__controls">
      <label class="category-filter">
        <span>Category</span>

        <select
          :value="selectedCategory ?? ''"
          :class="{ 'category-select--active': selectedCategory !== null }"
          @change="handleCategoryChange"
        >
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
            :class="{
              'quick-filter--active': selectedTimePeriod === period.value,
            }"
            :aria-pressed="selectedTimePeriod === period.value"
            @click="applyTimePeriod(period)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <button type="button" class="reset-button" @click="dashboardStore.resetFilters">
        Reset filters
      </button>
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
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-base);
}

.reset-button:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
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
  border-radius: var(--border-radius-sm);
  transition: var(--transition-base);
}

.category-filter select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgb(0 154 73 / 15%);
}

.category-select--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.quick-filters__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-filters button {
  padding: 8px 14px;
  color: var(--color-text);
  background: var(--color-surface-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-base);
}

.quick-filters button:hover:not(:disabled) {
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.quick-filters button.quick-filter--active {
  color: var(--color-primary-dark);
  font-weight: 700;
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

@media (min-width: 768px) {
  .filter-bar__controls {
    grid-template-columns: minmax(200px, 0.35fr) minmax(0, 1fr);
    align-items: end;
  }
}

@media (min-width: 1024px) {
  .filter-bar {
    background: transparent;
    border: 0;
    box-shadow: none;
    padding: 4px 0;
    margin-bottom: 0;
  }

  .filter-bar__heading {
    display: none;
  }

  .filter-bar__controls {
    grid-template-columns: minmax(150px, 0.25fr) minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
}
</style>
