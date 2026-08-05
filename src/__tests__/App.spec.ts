import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

import type { Transaction } from '@/types'
import App from '../App.vue'

vi.mock('@/services/spendingDataService', () => ({
  getSpendingData: vi.fn<() => Promise<Transaction[]>>().mockResolvedValue([]),
}))

describe('App', () => {
  it('renders the dashboard heading', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
            createSpy: vi.fn,
          }),
        ],
      },
    })

    expect(wrapper.text()).toContain('Customer Spending Insights')
  })
})
