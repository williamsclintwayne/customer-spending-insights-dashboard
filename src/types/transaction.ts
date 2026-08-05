export const spendingCategories = [
  "Groceries",
  "Utilities",
  "Entertainment",
  "Transport",
  "Other",
] as const

export type SpendingCategory = (typeof spendingCategories)[number]

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: SpendingCategory;
  description?: string;
  merchant?: string;
}
