import { describe, expect, it } from 'vitest'

import type { SpendingCategory } from '@/types'
import { CATEGORY_CHART_COLORS, createSpendingChartData } from '../chartData'

const spendingByCategory: Record<SpendingCategory, number> = {
  Groceries: 750,
  Utilities: 0,
  Entertainment: 250,
  Transport: 500,
  Other: 0,
}

describe('createSpendingChartData', () => {
  it('creates chart labels for categories with spending', () => {
    const result = createSpendingChartData(spendingByCategory)

    expect(result.labels).toEqual(['Groceries', 'Entertainment', 'Transport'])
  })

  it('creates matching category spending values', () => {
    const result = createSpendingChartData(spendingByCategory)

    expect(result.datasets[0]?.data).toEqual([750, 250, 500])
  })

  it('creates matching category colours', () => {
    const result = createSpendingChartData(spendingByCategory)

    expect(result.datasets[0]?.backgroundColor).toEqual([
      CATEGORY_CHART_COLORS.Groceries,
      CATEGORY_CHART_COLORS.Entertainment,
      CATEGORY_CHART_COLORS.Transport,
    ])
  })

  it('returns an empty chart dataset when all categories are zero', () => {
    const emptyTotals: Record<SpendingCategory, number> = {
      Groceries: 0,
      Utilities: 0,
      Entertainment: 0,
      Transport: 0,
      Other: 0,
    }

    const result = createSpendingChartData(emptyTotals)

    expect(result.labels).toEqual([])
    expect(result.datasets[0]?.data).toEqual([])
  })
})
