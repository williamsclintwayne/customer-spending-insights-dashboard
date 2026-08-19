import { describe, expect, it } from 'vitest'
import { isValidAmount, isValidDate, isValidDateRange } from '../validators'

describe('validators', () => {
  describe('isValidDate', () => {
    it('returns true for a valid date', () => {
      expect(isValidDate(new Date('2026-08-05'))).toBe(true)
    })

    it('returns false for an invalid date', () => {
      expect(isValidDate(new Date('invalid-date'))).toBe(false)
    })
  })

  describe('isValidDateRange', () => {
    it('returns true when the start date is before the end date', () => {
      const start = new Date('2026-07-01')
      const end = new Date('2026-07-31')

      expect(isValidDateRange(start, end)).toBe(true)
    })

    it('returns true when both dates are the same', () => {
      const date = new Date('2026-07-15')

      expect(isValidDateRange(date, date)).toBe(true)
    })

    it('returns false when the start date is after the end date', () => {
      const start = new Date('2026-08-01')
      const end = new Date('2026-07-01')

      expect(isValidDateRange(start, end)).toBe(false)
    })

    it('returns false when either date is invalid', () => {
      expect(isValidDateRange(new Date('invalid-date'), new Date('2026-07-01'))).toBe(false)
    })
  })

  describe('isValidAmount', () => {
    it('returns true for a positive finite amount', () => {
      expect(isValidAmount(100.5)).toBe(true)
    })

    it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
      'returns false for invalid amount %s',
      (amount) => {
        expect(isValidAmount(amount)).toBe(false)
      },
    )
  })
})
