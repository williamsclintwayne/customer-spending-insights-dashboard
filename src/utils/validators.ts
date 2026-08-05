export function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime())
}

export function isValidDateRange(start: Date, end: Date): boolean {
  return isValidDate(start) && isValidDate(end) && start.getTime() <= end.getTime()
}

export function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0
}
