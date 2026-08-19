import { spendingCategories, type SpendingCategory, type TimePeriod } from '@/types'

export const SPENDING_CATEGORIES: readonly SpendingCategory[] = spendingCategories

export interface TimePeriodOption {
  label: string
  value: TimePeriod
  days: number | null
}

export const TIME_PERIODS: readonly TimePeriodOption[] = [
  {
    label: 'Last 7 days',
    value: 'last_7_days',
    days: 7,
  },
  {
    label: 'Last 30 days',
    value: 'last_30_days',
    days: 30,
  },
  {
    label: 'Last 90 days',
    value: 'last_90_days',
    days: 90,
  },
  {
    label: 'Last year',
    value: 'last_year',
    days: 365,
  },
  {
    label: 'Custom',
    value: 'custom',
    days: null,
  },
]

export const DEFAULT_PAGE_SIZE = 10
