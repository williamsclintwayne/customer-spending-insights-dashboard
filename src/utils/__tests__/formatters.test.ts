import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatDateTime } from '../formatters'

describe('formatters', () => {
  it('formats currency as South African rand', () => {
    const result = formatCurrency(1234.56)

    expect(result).toContain('1')
    expect(result).toContain('234')
    expect(result).toContain('56')
    expect(result).toContain('R')
  })

  it('formats a date consistently', () => {
    const result = formatDate(new Date(2026, 0, 15))

    expect(result).toContain('15')
    expect(result).toContain('Jan')
    expect(result).toContain('2026')
  })

  it('formats a date and time consistently', () => {
    const result = formatDateTime(new Date(2026, 0, 15, 14, 30))

    expect(result).toContain('15')
    expect(result).toContain('Jan')
    expect(result).toContain('2026')
    expect(result).toContain('14')
    expect(result).toContain('30')
  })
})
