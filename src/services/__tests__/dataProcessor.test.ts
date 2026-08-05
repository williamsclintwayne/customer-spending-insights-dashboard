import { describe, expect, it } from 'vitest'
import type { Transaction } from '@/types'
import { filterValidTransactions, normalizeDateFormat, validateTransaction } from '../dataProcessor'

const validTransaction: Transaction = {
  id: 'transaction-1',
  date: '2026-08-05',
  category: 'Groceries',
  description: 'Weekly groceries',
  amount: 500,
  merchant: 'Checkers',
}

describe('dataProcessor', () => {
  it('normalizes an ISO date string', () => {
    const result = normalizeDateFormat('2026-08-05')

    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(7)
    expect(result.getDate()).toBe(5)
  })

  it('validates a valid transaction', () => {
    expect(validateTransaction(validTransaction)).toBe(true)
  })

  it('rejects an invalid transaction amount', () => {
    expect(
      validateTransaction({
        ...validTransaction,
        amount: 0,
      }),
    ).toBe(false)
  })

  it('rejects an invalid date', () => {
    expect(
      validateTransaction({
        ...validTransaction,
        date: 'invalid-date',
      }),
    ).toBe(false)
  })

  it('filters invalid transactions', () => {
    const result = filterValidTransactions([
      validTransaction,
      {
        ...validTransaction,
        id: 'transaction-2',
        amount: -50,
      },
    ])

    expect(result).toEqual([validTransaction])
  })
})
