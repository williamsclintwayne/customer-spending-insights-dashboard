<script setup lang="ts">
import { computed } from 'vue'
import type { ChartOptions, TooltipItem } from 'chart.js'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

import type { SpendingCategory } from '@/types'
import { createSpendingChartData, formatCurrency, SPENDING_CATEGORIES } from '@/utils'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  spendingByCategory: Record<SpendingCategory, number>
}

const props = defineProps<Props>()

const chartData = computed(() => createSpendingChartData(props.spendingByCategory))

const totalSpending = computed(() =>
  SPENDING_CATEGORIES.reduce((total, category) => total + props.spendingByCategory[category], 0),
)

const chartDescription = computed(() => {
  const categorySummary = SPENDING_CATEGORIES.filter(
    (category) => props.spendingByCategory[category] > 0,
  )
    .map((category) => `${category}: ${formatCurrency(props.spendingByCategory[category])}`)
    .join(', ')

  return `Spending breakdown by category. ${categorySummary}.`
})

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: {
    duration: 400,
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 18,
        usePointStyle: true,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label(context: TooltipItem<'doughnut'>): string {
          const value = typeof context.raw === 'number' ? context.raw : 0

          return `${context.label}: ${formatCurrency(value)}`
        },
      },
    },
  },
}
</script>

<template>
  <section class="chart-card" aria-labelledby="spending-chart-heading">
    <header class="chart-card__header">
      <div>
        <h2 id="spending-chart-heading">Spending by category</h2>
        <p>How filtered spending is distributed across categories.</p>
      </div>

      <div class="chart-card__total">
        <span>Total</span>
        <strong>{{ formatCurrency(totalSpending) }}</strong>
      </div>
    </header>

    <div v-if="totalSpending > 0" class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" :aria-label="chartDescription" role="img">
        Spending chart could not be displayed.
      </Doughnut>
    </div>

    <div v-else class="chart-empty">
      <p>No category spending is available for the selected filters.</p>
    </div>

    <dl class="category-summary">
      <div v-for="category in SPENDING_CATEGORIES" :key="category" class="category-summary__item">
        <dt>{{ category }}</dt>
        <dd>{{ formatCurrency(spendingByCategory[category]) }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.chart-card {
  min-width: 0;
  padding: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.chart-card__header {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

.chart-card__header p {
  margin: 7px 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.chart-card__total {
  display: grid;
  gap: 4px;
}

.chart-card__total span {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.chart-card__total strong {
  font-size: 1.15rem;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
}

.chart-empty {
  display: grid;
  min-height: 280px;
  place-items: center;
  color: var(--color-text-muted);
  text-align: center;
}

.category-summary {
  display: grid;
  gap: 10px;
  margin: 24px 0 0;
}

.category-summary__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.category-summary dt {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.category-summary dd {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
}

@media (min-width: 480px) {
  .chart-card__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .chart-card__total {
    text-align: right;
  }
}

@media (min-width: 768px) {
  .chart-wrapper {
    height: 320px;
  }
}
</style>
