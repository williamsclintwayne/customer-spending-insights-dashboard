<script setup lang="ts">
import { computed } from 'vue'

import { formatCurrency } from '@/utils'

interface Props {
  totalSpending: number
  averageSpending: number
  maxSpending: number
}

const props = defineProps<Props>()

const cards = computed(() => [
  {
    label: 'Total spending',
    value: formatCurrency(props.totalSpending),
    description: 'Across all filtered transactions',
  },
  {
    label: 'Average transaction',
    value: formatCurrency(props.averageSpending),
    description: 'Mean value per transaction',
  },
  {
    label: 'Highest single spend',
    value: formatCurrency(props.maxSpending),
    description: 'Largest filtered transaction',
  },
])
</script>

<template>
  <section class="stats-grid" aria-label="Spending summary">
    <article v-for="card in cards" :key="card.label" class="stats-card">
      <p class="stats-card__label">{{ card.label }}</p>
      <p class="stats-card__value">{{ card.value }}</p>
      <p class="stats-card__description">{{ card.description }}</p>
    </article>
  </section>
</template>

<style scoped>
.stats-grid {
  display: grid;
  gap: 16px;
}

.stats-card {
  padding: 22px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.stats-card__label {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
}

.stats-card__value {
  margin: 12px 0 8px;
  font-size: clamp(1.7rem, 4vw, 2.25rem);
  font-weight: 750;
  letter-spacing: -0.03em;
}

.stats-card__description {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
