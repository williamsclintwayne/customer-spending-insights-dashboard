<script setup lang="ts">
import { computed } from 'vue'

import type { ApiError, ApiErrorCode } from '@/services/apiError'

export interface DashboardStatusProps {
  isLoading: boolean
  apiError: ApiError | null
  isEmpty: boolean
}

const props = defineProps<DashboardStatusProps>()

const emit = defineEmits<{
  retry: []
  resetFilters: []
  signOut: []
}>()

interface ErrorConfig {
  heading: string
  message: string
  buttonLabel: string | null
  emitName: 'retry' | 'resetFilters' | 'signOut' | null
  icon: string
}

function resolveErrorConfig(code: ApiErrorCode): ErrorConfig {
  switch (code) {
    case 'UNAUTHORIZED':
      return {
        heading: 'Session expired',
        message: 'Your session has expired. Please sign in again.',
        buttonLabel: 'Sign in again',
        emitName: 'signOut',
        icon: '×',
      }
    case 'FORBIDDEN':
      return {
        heading: 'Access denied',
        message: 'You do not have permission to view this data.',
        buttonLabel: null,
        emitName: null,
        icon: '×',
      }
    case 'NOT_FOUND':
      return {
        heading: 'Service not found',
        message: 'The spending data service could not be found.',
        buttonLabel: null,
        emitName: null,
        icon: '?',
      }
    case 'BAD_REQUEST':
      return {
        heading: 'Invalid request',
        message: 'Check your filters and date range, then try again.',
        buttonLabel: 'Reset filters',
        emitName: 'resetFilters',
        icon: '!',
      }
    case 'RATE_LIMITED':
      return {
        heading: 'Too many requests',
        message: 'Please wait a moment before trying again.',
        buttonLabel: 'Try again',
        emitName: 'retry',
        icon: '!',
      }
    case 'SERVER_ERROR':
      return {
        heading: 'Server error',
        message: 'A server error occurred. Please try again.',
        buttonLabel: 'Try again',
        emitName: 'retry',
        icon: '!',
      }
    case 'SERVICE_UNAVAILABLE':
      return {
        heading: 'Service unavailable',
        message: 'The service is temporarily unavailable. Please try again shortly.',
        buttonLabel: 'Try again',
        emitName: 'retry',
        icon: '!',
      }
    case 'NETWORK_ERROR':
      return {
        heading: 'No internet connection',
        message: 'Check your connection and try again.',
        buttonLabel: 'Try again',
        emitName: 'retry',
        icon: '⊘',
      }
    case 'UNKNOWN':
      return {
        heading: 'Unable to load the dashboard',
        message: 'Something went wrong. Please try again.',
        buttonLabel: 'Try again',
        emitName: 'retry',
        icon: '!',
      }
  }
}

const errorConfig = computed((): ErrorConfig => {
  if (!props.apiError) {
    return resolveErrorConfig('UNKNOWN')
  }
  return resolveErrorConfig(props.apiError.code)
})

function handleErrorAction(): void {
  const name = errorConfig.value.emitName
  if (name === 'retry') emit('retry')
  else if (name === 'resetFilters') emit('resetFilters')
  else if (name === 'signOut') emit('signOut')
}
</script>

<template>
  <section v-if="isLoading" class="status-card" role="status" aria-live="polite">
    <div class="spinner" aria-hidden="true"></div>

    <div>
      <h2>Loading spending data</h2>
      <p>Please wait while the latest transaction information is prepared.</p>
    </div>
  </section>

  <section v-else-if="apiError" class="status-card status-card--error" role="alert">
    <div class="status-card__content">
      <div class="status-icon" aria-hidden="true">{{ errorConfig.icon }}</div>
      <div>
        <h2>{{ errorConfig.heading }}</h2>
        <p>{{ errorConfig.message }}</p>
      </div>
    </div>

    <button v-if="errorConfig.buttonLabel" type="button" @click="handleErrorAction">
      {{ errorConfig.buttonLabel }}
    </button>
  </section>

  <section v-else-if="isEmpty" class="status-card" role="status" aria-live="polite">
    <div>
      <h2>No transactions found</h2>
      <p>No spending data matches the selected filters and date range.</p>
    </div>

    <button type="button" @click="$emit('resetFilters')">Reset filters</button>
  </section>
</template>

<style scoped>
.status-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding: 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

.status-card--error {
  background: var(--color-danger-soft);
  border-color: rgb(180 35 24 / 25%);
}

.status-card__content {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.status-icon {
  flex-shrink: 0;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-danger);
  background: rgb(180 35 24 / 12%);
  border-radius: 50%;
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

p {
  margin: 8px 0 0;
  color: var(--color-text-muted);
}

button {
  padding: 10px 16px;
  color: #ffffff;
  font-weight: 700;
  background: var(--color-primary);
  border: 0;
  border-radius: 10px;
}

button:hover {
  background: var(--color-primary-dark);
}

.spinner {
  width: 34px;
  height: 34px;
  border: 4px solid var(--color-primary-soft);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 768px) {
  .status-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
