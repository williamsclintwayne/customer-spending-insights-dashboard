<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import DashboardHeader from '../components/DashboardHeader.vue'
import DashboardStatus from '../components/DashboardStatus.vue'
import FilterBar from '../components/FilterBar.vue'
import StatsCardsGrid from '../components/StatsCardsGrid.vue'
import SpendingChart from '@/components/SpendingChart.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

const {
  isLoading,
  errorMessage,
  filteredSpending,
  totalSpending,
  averageSpending,
  maxSpending,
  spendingByCategory,
} = storeToRefs(dashboardStore)

onMounted(() => {
  void dashboardStore.fetchSpendingData()
})
</script>

<template>
  <div class="dashboard-page">
    <main class="dashboard-container">
      <DashboardHeader />

      <FilterBar />

      <DashboardStatus
        v-if="isLoading || errorMessage || filteredSpending.length === 0"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :is-empty="!isLoading && !errorMessage && filteredSpending.length === 0"
        @retry="dashboardStore.fetchSpendingData"
        @reset-filters="dashboardStore.resetFilters"
      />

      <template v-else>
        <StatsCardsGrid
          :total-spending="totalSpending"
          :average-spending="averageSpending"
          :max-spending="maxSpending"
        />

        <section class="dashboard-content-grid" aria-label="Dashboard visualisations">
          <SpendingChart :spending-by-category="spendingByCategory" />

          <article class="dashboard-placeholder">
            <h2>Recent transactions</h2>
            <p>The sortable transactions table will be added in a separate feature.</p>
          </article>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 24px 16px 48px;
  background:
    radial-gradient(circle at top right, rgb(0 154 73 / 8%), transparent 32rem),
    var(--color-background);
}

.dashboard-container {
  width: min(100%, 1440px);
  margin: 0 auto;
}

.dashboard-content-grid {
  display: grid;
  gap: 20px;
  margin-top: 24px;
}

.dashboard-placeholder {
  min-height: 240px;
  padding: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.dashboard-placeholder h2 {
  margin: 0 0 8px;
  font-size: 1.125rem;
}

.dashboard-placeholder p {
  margin: 0;
  color: var(--color-text-muted);
}

@media (min-width: 768px) {
  .dashboard-page {
    padding: 32px 24px 64px;
  }
}

@media (min-width: 1024px) {
  .dashboard-placeholder-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  }
}
</style>
