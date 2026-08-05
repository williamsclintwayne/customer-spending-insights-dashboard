import { describe, expect, it, vi } from 'vitest'
import { getSpendingData } from '../spendingDataService'

describe('getSpendingData', () => {
  it('returns valid mocked spending transactions', async () => {
    vi.useFakeTimers()

    const request = getSpendingData()

    await vi.advanceTimersByTimeAsync(500)

    const transactions = await request

    expect(transactions).toHaveLength(120)
    expect(transactions.every((transaction) => transaction.amount > 0)).toBe(true)

    vi.useRealTimers()
  })
})
