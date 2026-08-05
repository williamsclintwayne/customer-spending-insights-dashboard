import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import type { Transaction } from '@/types'
import { useDashboardStore } from '../dashboard'

const transactions: Transaction[] = [
  {
    id: 'transaction-1',
    date: '2026-08-01',
    category: 'Groceries',
    description: 'Weekly groceries',
    amount: 500,
    merchant: 'Checkers',
  },
  {
    id: 'transaction-2',
    date: '2026-08-02',
    category: 'Transport',
    description: 'Fuel',
    amount: 750,
    merchant: 'Engen',
  },
  {
    id: 'transaction-3',
    date: '2026-08-03',
    category: 'Groceries',
    description: 'Household supplies',
    amount: 250,
    merchant: 'Pick n Pay',
  },
]

describe('useDashboardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('starts with the expected default state', () => {
    const store = useDashboardStore()

    expect(store.spendingData).toEqual([])
    expect(store.selectedCategory).toBeNull()
    expect(store.sortBy).toBe('date')
    expect(store.sortOrder).toBe('desc')
    expect(store.isLoading).toBe(false)
    expect(store.errorMessage).toBeNull()
  })

  it('filters transactions by category', () => {
    const store = useDashboardStore()

    store.spendingData = transactions
    store.setDateRange(new Date('2026-08-01T00:00:00'), new Date('2026-08-31T23:59:59'))
    store.setCategory('Groceries')

    expect(store.filteredSpending).toHaveLength(2)
    expect(
      store.filteredSpending.every((transaction) => transaction.category === 'Groceries'),
    ).toBe(true)
  })

  it('filters transactions by date range', () => {
    const store = useDashboardStore()

    store.spendingData = transactions
    store.setDateRange(new Date('2026-08-02T00:00:00'), new Date('2026-08-03T23:59:59'))

    expect(store.filteredSpending.map((transaction) => transaction.id)).toEqual([
      'transaction-2',
      'transaction-3',
    ])
  })

  it('calculates dashboard metrics from filtered transactions', () => {
    const store = useDashboardStore()

    store.spendingData = transactions
    store.setDateRange(new Date('2026-08-01T00:00:00'), new Date('2026-08-31T23:59:59'))

    expect(store.totalSpending).toBe(1500)
    expect(store.averageSpending).toBe(500)
    expect(store.maxSpending).toBe(750)
  })

  it('groups spending by category', () => {
    const store = useDashboardStore()

    store.spendingData = transactions
    store.setDateRange(new Date('2026-08-01T00:00:00'), new Date('2026-08-31T23:59:59'))

    expect(store.spendingByCategory).toEqual({
      Groceries: 750,
      Utilities: 0,
      Entertainment: 0,
      Transport: 750,
      Other: 0,
    })
  })

  it('sorts transactions by amount in ascending order', () => {
    const store = useDashboardStore()

    store.spendingData = transactions
    store.setDateRange(new Date('2026-08-01T00:00:00'), new Date('2026-08-31T23:59:59'))
    store.setSortBy('amount', 'asc')

    expect(store.sortedTransactions.map((transaction) => transaction.amount)).toEqual([
      250, 500, 750,
    ])
  })

  it('sorts transactions by date in descending order', () => {
    const store = useDashboardStore()

    store.spendingData = transactions
    store.setDateRange(new Date('2026-08-01T00:00:00'), new Date('2026-08-31T23:59:59'))
    store.setSortBy('date', 'desc')

    expect(store.sortedTransactions.map((transaction) => transaction.id)).toEqual([
      'transaction-3',
      'transaction-2',
      'transaction-1',
    ])
  })

  it('updates the selected category', () => {
    const store = useDashboardStore()

    store.setCategory('Utilities')

    expect(store.selectedCategory).toBe('Utilities')
  })

  it('updates the selected date range', () => {
    const store = useDashboardStore()
    const start = new Date('2026-07-01')
    const end = new Date('2026-07-31')

    store.setDateRange(start, end)

    expect(store.selectedDateRange).toEqual({ start, end })
  })

  it('resets the category filter', () => {
    const store = useDashboardStore()

    store.setCategory('Entertainment')
    store.resetFilters()

    expect(store.selectedCategory).toBeNull()
  })
})
