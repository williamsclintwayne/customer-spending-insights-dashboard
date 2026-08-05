import type { SpendingCategory, Transaction } from '@/types'

const categoryWeights: ReadonlyArray<{
  category: SpendingCategory
  weight: number
}> = [
  { category: 'Groceries', weight: 35 },
  { category: 'Utilities', weight: 15 },
  { category: 'Entertainment', weight: 15 },
  { category: 'Transport', weight: 20 },
  { category: 'Other', weight: 15 },
]

const merchantsByCategory: Record<SpendingCategory, readonly string[]> = {
  Groceries: ['Checkers', 'Pick n Pay', 'Woolworths Food', 'Shoprite', 'Spar'],
  Utilities: ['Eskom', 'Municipality', 'Vodacom', 'MTN', 'Afrihost'],
  Entertainment: ['Netflix', 'Showmax', 'Ster-Kinekor', 'Steam', 'Spotify'],
  Transport: ['Engen', 'Shell', 'Uber', 'Bolt', 'Golden Arrow'],
  Other: ['Clicks', 'Dis-Chem', 'Takealot', 'Mr Price', 'Builders'],
}

const descriptionsByCategory: Record<SpendingCategory, readonly string[]> = {
  Groceries: ['Weekly groceries', 'Household supplies', 'Fresh produce', 'Monthly groceries'],
  Utilities: ['Electricity payment', 'Water bill', 'Mobile data', 'Internet subscription'],
  Entertainment: [
    'Streaming subscription',
    'Movie tickets',
    'Gaming purchase',
    'Music subscription',
  ],
  Transport: ['Fuel purchase', 'Ride booking', 'Public transport', 'Vehicle expense'],
  Other: ['Pharmacy purchase', 'Online order', 'Clothing purchase', 'Home supplies'],
}

function randomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length)
  const item = items[index]

  if (item === undefined) {
    throw new Error('Cannot select a random item from an empty array')
  }

  return item
}

function randomAmount(min = 5, max = 200): number {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

function randomDateWithinLastDays(days: number, referenceDate: Date): string {
  const offset = Math.floor(Math.random() * days)
  const date = new Date(referenceDate)

  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - offset)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function selectWeightedCategory(): SpendingCategory {
  const totalWeight = categoryWeights.reduce((total, item) => total + item.weight, 0)
  let randomWeight = Math.random() * totalWeight

  for (const item of categoryWeights) {
    randomWeight -= item.weight

    if (randomWeight <= 0) {
      return item.category
    }
  }

  return 'Other'
}

export function generateSpendingData(
  transactionCount = 120,
  referenceDate = new Date(),
): Transaction[] {
  return Array.from({ length: transactionCount }, (_, index) => {
    const category = selectWeightedCategory()

    return {
      id: `transaction-${index + 1}`,
      date: randomDateWithinLastDays(90, referenceDate),
      category,
      description: randomItem(descriptionsByCategory[category]),
      amount: randomAmount(),
      merchant: randomItem(merchantsByCategory[category]),
    }
  })
}
