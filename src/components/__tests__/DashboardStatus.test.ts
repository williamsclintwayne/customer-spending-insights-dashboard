import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { ApiError } from '@/services/apiError'
import DashboardStatus from '../DashboardStatus.vue'

describe('DashboardStatus', () => {
  it('renders the loading state', () => {
    const wrapper = mount(DashboardStatus, {
      props: { isLoading: true, apiError: null, isEmpty: false },
    })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading spending data')
  })

  it('renders the empty state', () => {
    const wrapper = mount(DashboardStatus, {
      props: { isLoading: false, apiError: null, isEmpty: true },
    })

    expect(wrapper.text()).toContain('No transactions found')
    expect(wrapper.find('button').text()).toBe('Reset filters')
  })

  it('renders session expired heading and sign-in button for UNAUTHORIZED', () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('UNAUTHORIZED', 401, 'Session expired'),
        isEmpty: false,
      },
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Session expired')
    expect(wrapper.find('button').text()).toBe('Sign in again')
  })

  it('emits signOut when the sign-in button is clicked for UNAUTHORIZED', async () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('UNAUTHORIZED', 401, 'Session expired'),
        isEmpty: false,
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('signOut')).toBeDefined()
    expect(wrapper.emitted('retry')).toBeUndefined()
  })

  it('renders access denied with no action button for FORBIDDEN', () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('FORBIDDEN', 403, 'Forbidden'),
        isEmpty: false,
      },
    })

    expect(wrapper.text()).toContain('Access denied')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders service not found with no action button for NOT_FOUND', () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('NOT_FOUND', 404, 'Not found'),
        isEmpty: false,
      },
    })

    expect(wrapper.text()).toContain('Service not found')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders reset filters button for BAD_REQUEST and emits resetFilters', async () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('BAD_REQUEST', 400, 'Bad request'),
        isEmpty: false,
      },
    })

    expect(wrapper.text()).toContain('Invalid request')
    expect(wrapper.find('button').text()).toBe('Reset filters')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('resetFilters')).toBeDefined()
  })

  it('renders Try again for SERVER_ERROR and emits retry on click', async () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('SERVER_ERROR', 500, 'Server error'),
        isEmpty: false,
      },
    })

    expect(wrapper.text()).toContain('Server error')
    expect(wrapper.find('button').text()).toBe('Try again')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('retry')).toBeDefined()
  })

  it('renders Try again for NETWORK_ERROR', () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('NETWORK_ERROR', null, 'Network failure'),
        isEmpty: false,
      },
    })

    expect(wrapper.text()).toContain('No internet connection')
    expect(wrapper.find('button').text()).toBe('Try again')
  })

  it('renders Try again for SERVICE_UNAVAILABLE', () => {
    const wrapper = mount(DashboardStatus, {
      props: {
        isLoading: false,
        apiError: new ApiError('SERVICE_UNAVAILABLE', 503, 'Unavailable'),
        isEmpty: false,
      },
    })

    expect(wrapper.text()).toContain('Service unavailable')
    expect(wrapper.find('button').text()).toBe('Try again')
  })
})
