import type { Transaction } from '@/types'
import { isValidAmount } from '@/utils'

export function normalizeDateFormat(date: string): Date {
  return new Date(`${date}T00:00:00`)
}

export function validateTransaction(transaction: Transaction): boolean {
  const normalizedDate = normalizeDateFormat(transaction.date)

  return (
    typeof transaction.id === 'string' &&
    transaction.id.trim().length > 0 &&
    typeof transaction.description === 'string' &&
    transaction.description.trim().length > 0 &&
    !Number.isNaN(normalizedDate.getTime()) &&
    isValidAmount(transaction.amount)
  )
}

export function filterValidTransactions(transactions: readonly Transaction[]): Transaction[] {
  return transactions.filter(validateTransaction)
}
