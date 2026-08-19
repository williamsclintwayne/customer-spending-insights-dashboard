import { describe, expect, it } from 'vitest'
import { spendingCategories } from '@/types'
import { generateSpendingData } from '../spendingDataGenerator'

describe('generateSpendingData', () => {
  it('generates the requested number of transactions', () => {
    const transactions = generateSpendingData(100, new Date('2026-08-05'))

    expect(transactions).toHaveLength(100)
  })

  it('generates unique transaction identifiers', () => {
    const transactions = generateSpendingData(100, new Date('2026-08-05'))
    const ids = new Set(transactions.map((transaction) => transaction.id))

    expect(ids.size).toBe(100)
  })

  it('generates valid categories and positive amounts', () => {
    const transactions = generateSpendingData(100, new Date('2026-08-05'))

    for (const transaction of transactions) {
      expect(spendingCategories).toContain(transaction.category)
      expect(transaction.amount).toBeGreaterThan(0)
      expect(transaction.amount).toBeLessThanOrEqual(200)
    }
  })

  it('generates dates within the last 90 days', () => {
    const referenceDate = new Date('2026-08-05T00:00:00')
    const earliestDate = new Date(referenceDate)

    earliestDate.setDate(earliestDate.getDate() - 89)

    const transactions = generateSpendingData(100, referenceDate)

    for (const transaction of transactions) {
      const transactionDate = new Date(`${transaction.date}T00:00:00`)

      expect(transactionDate.getTime()).toBeGreaterThanOrEqual(earliestDate.getTime())
      expect(transactionDate.getTime()).toBeLessThanOrEqual(referenceDate.getTime())
    }
  })
})
