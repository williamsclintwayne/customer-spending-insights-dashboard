import type { SpendingCategory } from './transaction'

export type SortField = 'date' | 'amount' | 'category';

export type SortOrder = 'asc' | 'desc';

export type TimePeriod = "last_7_days" | "last_30_days" | "last_90_days" | "last_year" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardFilters {
  selectedDateRange: DateRange;
  selectedCategory: SpendingCategory | null;
  selectedTimePeriod: TimePeriod;
}

export interface SortSettings {
  sortBy: SortField;
  sortOrder: SortOrder;
}
