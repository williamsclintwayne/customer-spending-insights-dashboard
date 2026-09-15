import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

import type { Transaction } from '@/types'
import App from '../App.vue'

vi.mock('@/services/spendingDataService', () => ({
  getSpendingData: vi.fn<() => Promise<Transaction[]>>().mockResolvedValue([]),
}))

describe('App', () => {
  it('renders the mock sign-in screen with demo accounts collapsed', async () => {
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

    expect(wrapper.text()).toContain('Welcome back')
    expect(wrapper.text()).toContain('Show accounts')
    expect(wrapper.text()).not.toContain('demo.user@spendwise.test')

    await wrapper.get('button.demo-accounts__toggle').trigger('click')

    expect(wrapper.text()).toContain('demo.user@spendwise.test')
    expect(wrapper.text()).toContain('analyst@spendwise.test')
  })
})
