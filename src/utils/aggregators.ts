import type { SpendingCategory, Transaction } from '@/types'
import { SPENDING_CATEGORIES } from './constants'

export function sumAmounts(transactions: readonly Transaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0)
}

export function calculateAverage(transactions: readonly Transaction[]): number {
  if (transactions.length === 0) {
    return 0
  }

  return sumAmounts(transactions) / transactions.length
}

export function findMax(transactions: readonly Transaction[]): number {
  if (transactions.length === 0) {
    return 0
  }

  return Math.max(...transactions.map((transaction) => transaction.amount))
}

export function groupByCategory(
  transactions: readonly Transaction[],
): Record<SpendingCategory, number> {
  const totals = Object.fromEntries(SPENDING_CATEGORIES.map((category) => [category, 0])) as Record<
    SpendingCategory,
    number
  >

  for (const transaction of transactions) {
    totals[transaction.category] += transaction.amount
  }

  return totals
}
