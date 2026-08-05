import type { ChartData } from 'chart.js'

import type { SpendingCategory } from '@/types'
import { SPENDING_CATEGORIES } from './constants'

export const CATEGORY_CHART_COLORS: Record<SpendingCategory, string> = {
  Groceries: '#009A49',
  Utilities: '#1565C0',
  Entertainment: '#7B1FA2',
  Transport: '#EF6C00',
  Other: '#607D8B',
}

export function createSpendingChartData(
  spendingByCategory: Record<SpendingCategory, number>,
): ChartData<'doughnut'> {
  const categoriesWithSpending = SPENDING_CATEGORIES.filter(
    (category) => spendingByCategory[category] > 0,
  )

  return {
    labels: categoriesWithSpending,
    datasets: [
      {
        label: 'Spending',
        data: categoriesWithSpending.map((category) => spendingByCategory[category]),
        backgroundColor: categoriesWithSpending.map((category) => CATEGORY_CHART_COLORS[category]),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  }
}
