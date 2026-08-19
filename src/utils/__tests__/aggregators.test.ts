import { describe, expect, it } from 'vitest'
import type { Transaction } from '@/types'
import { calculateAverage, findMax, groupByCategory, sumAmounts } from '../aggregators'

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

describe('aggregators', () => {
  describe('sumAmounts', () => {
    it('returns the sum of all transaction amounts', () => {
      expect(sumAmounts(transactions)).toBe(1500)
    })

    it('returns zero for an empty array', () => {
      expect(sumAmounts([])).toBe(0)
    })
  })

  describe('calculateAverage', () => {
    it('returns the average transaction amount', () => {
      expect(calculateAverage(transactions)).toBe(500)
    })

    it('returns zero for an empty array', () => {
      expect(calculateAverage([])).toBe(0)
    })
  })

  describe('findMax', () => {
    it('returns the largest transaction amount', () => {
      expect(findMax(transactions)).toBe(750)
    })

    it('returns zero for an empty array', () => {
      expect(findMax([])).toBe(0)
    })
  })

  describe('groupByCategory', () => {
    it('groups and totals transactions by category', () => {
      expect(groupByCategory(transactions)).toEqual({
        Groceries: 750,
        Utilities: 0,
        Entertainment: 0,
        Transport: 750,
        Other: 0,
      })
    })
  })
})
