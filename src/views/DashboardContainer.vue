<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import DashboardHeader from '@/components/DashboardHeader.vue'
import DashboardStatus from '@/components/DashboardStatus.vue'
import FilterBar from '@/components/FilterBar.vue'
import StatsCardsGrid from '@/components/StatsCardsGrid.vue'
import SpendingChart from '@/components/SpendingChart.vue'
import TransactionsTable from '@/components/TransactionsTable.vue'
import DevErrorPanel from '@/components/DevErrorPanel.vue'
import { useDashboardStore } from '@/stores/dashboard'

const emit = defineEmits<{
  signOut: []
}>()

const dashboardStore = useDashboardStore()

const {
  isLoading,
  apiError,
  filteredSpending,
  totalSpending,
  averageSpending,
  maxSpending,
  spendingByCategory,
  sortedTransactions,
  sortBy,
  sortOrder,
} = storeToRefs(dashboardStore)

onMounted(() => {
  void dashboardStore.fetchSpendingData()
})
</script>

<template>
  <div class="dashboard-page">
    <main class="dashboard-container">
      <div class="dashboard-topbar">
        <button type="button" class="sign-out-btn" @click="emit('signOut')">Sign out</button>
      </div>

      <DashboardHeader />

      <FilterBar />

      <div class="dashboard-main-content">
        <DashboardStatus
          v-if="isLoading || apiError || filteredSpending.length === 0"
          :is-loading="isLoading"
          :api-error="apiError"
          :is-empty="!isLoading && !apiError && filteredSpending.length === 0"
          @retry="dashboardStore.fetchSpendingData"
          @reset-filters="dashboardStore.resetFilters"
          @sign-out="emit('signOut')"
        />

        <template v-else>
          <StatsCardsGrid
            :total-spending="totalSpending"
            :average-spending="averageSpending"
            :max-spending="maxSpending"
          />

          <section class="dashboard-content-grid" aria-label="Dashboard visualisations">
            <SpendingChart :spending-by-category="spendingByCategory" />

            <TransactionsTable
              :transactions="sortedTransactions"
              :sort-by="sortBy"
              :sort-order="sortOrder"
              @sort="dashboardStore.setSortBy"
            />
          </section>
        </template>
      </div>
    </main>

    <DevErrorPanel />
  </div>
</template>

<style scoped>
.dashboard-topbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.sign-out-btn {
  min-height: 36px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-base);
}

.sign-out-btn:hover {
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-text-muted);
}

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

@media (min-width: 768px) {
  .dashboard-page {
    padding: 32px 24px 64px;
  }
}

@media (min-width: 1024px) {
  .dashboard-page {
    height: 100vh;
    overflow: hidden;
    padding-bottom: 16px;
  }

  .dashboard-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }

  .dashboard-main-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }

  .dashboard-content-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
    flex: 1;
    min-height: 0;
    margin-top: 0;
    align-items: stretch;
  }
}
</style>
