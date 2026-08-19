<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { selectedDateRange } = storeToRefs(dashboardStore)

const startDate = computed({
  get: () => formatDateInput(selectedDateRange.value.start),
  set: (value: string) => {
    if (!value) {
      return
    }

    dashboardStore.setDateRange(parseDateInput(value, false), selectedDateRange.value.end, 'custom')
  },
})

const endDate = computed({
  get: () => formatDateInput(selectedDateRange.value.end),
  set: (value: string) => {
    if (!value) {
      return
    }

    dashboardStore.setDateRange(
      selectedDateRange.value.start,
      parseDateInput(value, true),
      'custom',
    )
  },
})

function formatDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDateInput(value: string, endOfDay: boolean): Date {
  const [yearValue, monthValue, dayValue] = value.split('-')

  if (!yearValue || !monthValue || !dayValue) {
    return new Date(Number.NaN)
  }

  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)

  const date = new Date(year, month - 1, day)

  if (endOfDay) {
    date.setHours(23, 59, 59, 999)
  } else {
    date.setHours(0, 0, 0, 0)
  }

  return date
}
</script>

<template>
  <header class="dashboard-header">
    <div>
      <p class="dashboard-header__eyebrow">Financial overview</p>
      <h1>Customer Spending Insights</h1>
      <p class="dashboard-header__description">
        Analyse transaction activity, category trends and customer spending behaviour.
      </p>
    </div>

    <fieldset class="date-range">
      <legend class="sr-only">Dashboard date range</legend>

      <label>
        <span>Start date</span>
        <input v-model="startDate" type="date" :max="endDate" />
      </label>

      <label>
        <span>End date</span>
        <input v-model="endDate" type="date" :min="startDate" />
      </label>
    </fieldset>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.dashboard-header__eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  line-height: 1.1;
}

.dashboard-header__description {
  max-width: 680px;
  margin: 12px 0 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.date-range {
  display: grid;
  gap: 12px;
  min-width: min(100%, 360px);
  margin: 0;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.date-range label {
  display: grid;
  gap: 6px;
}

.date-range span {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.date-range input {
  width: 100%;
  padding: 10px 12px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

@media (min-width: 768px) {
  .date-range {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}
</style>
