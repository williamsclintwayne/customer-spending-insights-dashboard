import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { Transaction } from '@/types'
import TransactionsTable from '../TransactionsTable.vue'

const transactions: Transaction[] = Array.from({ length: 12 }, (_, index) => ({
  id: `transaction-${index + 1}`,
  date: `2026-08-${String(index + 1).padStart(2, '0')}`,
  category: index % 2 === 0 ? 'Groceries' : 'Transport',
  description: `Transaction ${index + 1}`,
  amount: (index + 1) * 100,
  merchant: 'Test Merchant',
}))

describe('TransactionsTable', () => {
  it('renders the first page of transactions', () => {
    const wrapper = mount(TransactionsTable, {
      props: {
        transactions,
        sortBy: 'date',
        sortOrder: 'desc',
      },
    })

    expect(wrapper.text()).toContain('Transaction 1')
    expect(wrapper.text()).toContain('Transaction 10')
    expect(wrapper.text()).not.toContain('Transaction 11')
  })

  it('moves to the next page', async () => {
    const wrapper = mount(TransactionsTable, {
      props: {
        transactions,
        sortBy: 'date',
        sortOrder: 'desc',
      },
    })

    const nextButton = wrapper.findAll('button').find((button) => button.text() === 'Next')

    expect(nextButton).toBeDefined()

    await nextButton?.trigger('click')

    expect(wrapper.text()).toContain('Transaction 11')
    expect(wrapper.text()).toContain('Transaction 12')
    expect(wrapper.text()).toContain('Showing 11–12 of 12')
    expect(wrapper.text()).toContain('Page 2 of 2')
  })

  it('emits ascending date sort when a different date order is requested', async () => {
    const wrapper = mount(TransactionsTable, {
      props: {
        transactions,
        sortBy: 'amount',
        sortOrder: 'desc',
      },
    })

    const sortButtons = wrapper.findAll('.sort-button')

    await sortButtons[0]?.trigger('click')

    expect(wrapper.emitted('sort')).toEqual([['date', 'asc']])
  })

  it('toggles the active amount sort order', async () => {
    const wrapper = mount(TransactionsTable, {
      props: {
        transactions,
        sortBy: 'amount',
        sortOrder: 'asc',
      },
    })

    const sortButtons = wrapper.findAll('.sort-button')

    await sortButtons[1]?.trigger('click')

    expect(wrapper.emitted('sort')).toEqual([['amount', 'desc']])
  })

  it('renders the empty state', () => {
    const wrapper = mount(TransactionsTable, {
      props: {
        transactions: [],
        sortBy: 'date',
        sortOrder: 'desc',
      },
    })

    expect(wrapper.text()).toContain('No transactions are available for the selected filters.')
  })
})
