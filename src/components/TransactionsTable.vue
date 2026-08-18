<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { SortField, SortOrder, Transaction } from '@/types'
import { DEFAULT_PAGE_SIZE, formatCurrency, formatDate } from '@/utils'

interface Props {
  transactions: readonly Transaction[]
  sortBy: SortField
  sortOrder: SortOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sort: [field: SortField, order: SortOrder]
}>()

const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.transactions.length / DEFAULT_PAGE_SIZE)),
)

const paginatedTransactions = computed(() => {
  const startIndex = (currentPage.value - 1) * DEFAULT_PAGE_SIZE
  const endIndex = startIndex + DEFAULT_PAGE_SIZE

  return props.transactions.slice(startIndex, endIndex)
})

const visibleStart = computed(() => {
  if (props.transactions.length === 0) {
    return 0
  }

  return (currentPage.value - 1) * DEFAULT_PAGE_SIZE + 1
})

const visibleEnd = computed(() =>
  Math.min(currentPage.value * DEFAULT_PAGE_SIZE, props.transactions.length),
)

watch(
  () => props.transactions,
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount
  }
})

function requestSort(field: SortField): void {
  const nextOrder: SortOrder = props.sortBy === field && props.sortOrder === 'asc' ? 'desc' : 'asc'

  emit('sort', field, nextOrder)
}

function goToPreviousPage(): void {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

function goToNextPage(): void {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

function sortIndicator(field: SortField): string {
  if (props.sortBy !== field) {
    return ''
  }

  return props.sortOrder === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <section class="transactions-card" aria-labelledby="transactions-heading">
    <header class="transactions-card__header">
      <div>
        <h2 id="transactions-heading">Recent transactions</h2>
        <p>Review filtered customer spending activity.</p>
      </div>

      <span class="transactions-card__count"> {{ transactions.length }} transactions </span>
    </header>

    <div v-if="transactions.length > 0" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">
              <button
                type="button"
                class="sort-button"
                :aria-sort="
                  sortBy === 'date' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'
                "
                @click="requestSort('date')"
              >
                Date
                <span aria-hidden="true">{{ sortIndicator('date') }}</span>
              </button>
            </th>

            <th scope="col">Category</th>
            <th scope="col">Description</th>

            <th scope="col" class="amount-column">
              <button
                type="button"
                class="sort-button sort-button--amount"
                :aria-sort="
                  sortBy === 'amount' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'
                "
                @click="requestSort('amount')"
              >
                Amount
                <span aria-hidden="true">{{ sortIndicator('amount') }}</span>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
            <td data-label="Date">
              {{ formatDate(new Date(`${transaction.date}T00:00:00`)) }}
            </td>
            <td data-label="Category">
              <span class="category-badge">
                {{ transaction.category }}
              </span>
            </td>
            <td data-label="Description">
              <strong>{{ transaction.description }}</strong>
              <span v-if="transaction.merchant" class="merchant">
                {{ transaction.merchant }}
              </span>
            </td>
            <td data-label="Amount" class="amount-column">
              {{ formatCurrency(transaction.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="transactions-empty">
      <p>No transactions are available for the selected filters.</p>
    </div>

    <footer
      v-if="transactions.length > 0"
      class="transactions-pagination"
      aria-label="Transaction pagination"
    >
      <p>
        Showing {{ visibleStart }}–{{ visibleEnd }} of
        {{ transactions.length }}
      </p>

      <div class="transactions-pagination__controls">
        <button type="button" :disabled="currentPage === 1" @click="goToPreviousPage">
          Previous
        </button>

        <span>Page {{ currentPage }} of {{ totalPages }}</span>

        <button type="button" :disabled="currentPage === totalPages" @click="goToNextPage">
          Next
        </button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.transactions-card {
  min-width: 0;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.transactions-card__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

.transactions-card__header p {
  margin: 7px 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.transactions-card__count {
  color: var(--color-primary-dark);
  font-size: 0.85rem;
  font-weight: 700;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #f8faf9;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover {
  background: #fbfdfc;
}

.sort-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: auto;
  padding: 0;
  color: inherit;
  font: inherit;
  background: transparent;
  border: 0;
}

.sort-button--amount {
  justify-content: flex-end;
}

.amount-column {
  text-align: right;
  white-space: nowrap;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 10px;
  color: var(--color-primary-dark);
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--color-primary-soft);
  border-radius: 999px;
}

td strong {
  display: block;
  font-size: 0.9rem;
}

.merchant {
  display: block;
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.transactions-empty {
  display: grid;
  min-height: 260px;
  place-items: center;
  padding: 24px;
  color: var(--color-text-muted);
  text-align: center;
}

.transactions-pagination {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 24px;
  border-top: 1px solid var(--color-border);
}

.transactions-pagination p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.transactions-pagination__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.transactions-pagination__controls button {
  padding: 8px 14px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.transactions-pagination__controls button:hover:not(:disabled) {
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
}

.transactions-pagination__controls button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.transactions-pagination__controls span {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

@media (max-width: 639px) {
  .table-scroll {
    overflow: visible;
  }

  table,
  thead,
  tbody,
  tr,
  th,
  td {
    display: block;
  }

  thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  tbody {
    display: grid;
    gap: 12px;
    padding: 16px;
  }

  tbody tr {
    padding: 16px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }

  tbody tr:hover {
    background: var(--color-surface);
  }

  td {
    display: grid;
    grid-template-columns: 100px minmax(0, 1fr);
    gap: 12px;
    padding: 8px 0;
    text-align: right;
    border-bottom: 1px solid var(--color-border);
  }

  td:last-child {
    border-bottom: 0;
  }

  td::before {
    content: attr(data-label);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    font-weight: 700;
    text-align: left;
    text-transform: uppercase;
  }

  td strong,
  .merchant {
    text-align: right;
  }
}

@media (min-width: 640px) {
  .transactions-card__header,
  .transactions-pagination {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
