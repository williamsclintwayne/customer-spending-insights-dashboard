import type { Transaction } from '@/types'
import { generateSpendingData } from '@/mocks/spendingDataGenerator'
import { filterValidTransactions } from './dataProcessor'

const MOCK_API_DELAY_MS = 500

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

export async function getSpendingData(): Promise<Transaction[]> {
  await delay(MOCK_API_DELAY_MS)

  const transactions = generateSpendingData(120)

  return filterValidTransactions(transactions)
}
