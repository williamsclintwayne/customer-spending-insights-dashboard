import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { DateRange, SortField, SortOrder, SpendingCategory, Transaction } from '@/types'
import { getSpendingData } from '@/services/spendingDataService'
import { normalizeDateFormat } from '@/services/dataProcessor'
import { calculateAverage, findMax, groupByCategory, sumAmounts } from '@/utils'

function createDefaultDateRange(): DateRange {
  const end = new Date()
  const start = new Date(end)

  start.setDate(start.getDate() - 89)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export const useDashboardStore = defineStore('dashboard', () => {
  const spendingData = ref<Transaction[]>([])
  const selectedDateRange = ref<DateRange>(createDefaultDateRange())
  const selectedCategory = ref<SpendingCategory | null>(null)
  const sortBy = ref<SortField>('date')
  const sortOrder = ref<SortOrder>('desc')
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const filteredSpending = computed(() => {
    const startTime = selectedDateRange.value.start.getTime()
    const endTime = selectedDateRange.value.end.getTime()

    return spendingData.value.filter((transaction) => {
      const transactionTime = normalizeDateFormat(transaction.date).getTime()
      const matchesDateRange = transactionTime >= startTime && transactionTime <= endTime
      const matchesCategory =
        selectedCategory.value === null || transaction.category === selectedCategory.value

      return matchesDateRange && matchesCategory
    })
  })

  const totalSpending = computed(() => sumAmounts(filteredSpending.value))

  const averageSpending = computed(() => calculateAverage(filteredSpending.value))

  const maxSpending = computed(() => findMax(filteredSpending.value))

  const spendingByCategory = computed(() => groupByCategory(filteredSpending.value))

  const sortedTransactions = computed(() => {
    return [...filteredSpending.value].sort((first, second) => {
      let comparison = 0

      if (sortBy.value === 'amount') {
        comparison = first.amount - second.amount
      } else {
        comparison =
          normalizeDateFormat(first.date).getTime() - normalizeDateFormat(second.date).getTime()
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })

  async function fetchSpendingData(): Promise<void> {
    isLoading.value = true
    errorMessage.value = null

    try {
      spendingData.value = await getSpendingData()
    } catch (error: unknown) {
      spendingData.value = []
      errorMessage.value = error instanceof Error ? error.message : 'Unable to load spending data.'
    } finally {
      isLoading.value = false
    }
  }

  function setDateRange(start: Date, end: Date): void {
    selectedDateRange.value = { start, end }
  }

  function setCategory(category: SpendingCategory | null): void {
    selectedCategory.value = category
  }

  function setSortBy(field: SortField, order: SortOrder): void {
    sortBy.value = field
    sortOrder.value = order
  }

  function resetFilters(): void {
    selectedDateRange.value = createDefaultDateRange()
    selectedCategory.value = null
  }

  return {
    spendingData,
    selectedDateRange,
    selectedCategory,
    sortBy,
    sortOrder,
    isLoading,
    errorMessage,
    filteredSpending,
    totalSpending,
    averageSpending,
    maxSpending,
    spendingByCategory,
    sortedTransactions,
    fetchSpendingData,
    setDateRange,
    setCategory,
    setSortBy,
    resetFilters,
  }
})
