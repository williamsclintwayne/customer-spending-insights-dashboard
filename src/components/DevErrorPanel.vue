<script setup lang="ts">
import { ref } from 'vue'

import { useDashboardStore } from '@/stores/dashboard'
import { ERROR_SCENARIOS, selectedScenarioKey } from '@/mocks/errorSimulator'

const isDev = import.meta.env.DEV

const isExpanded = ref(true)

const dashboardStore = useDashboardStore()

function reload(): void {
  void dashboardStore.fetchSpendingData()
}
</script>

<template>
  <div v-if="isDev" class="dev-panel-root">
    <button
      v-if="!isExpanded"
      type="button"
      class="dev-panel__trigger"
      aria-label="Open error simulator"
      @click="isExpanded = true"
    >
      ⚙ DEV
    </button>

    <div v-else class="dev-panel" aria-label="Developer error simulator">
      <div class="dev-panel__header">
        <p class="dev-panel__title">Dev: Error Simulator</p>
        <button
          type="button"
          class="dev-panel__close"
          aria-label="Close error simulator"
          @click="isExpanded = false"
        >
          ×
        </button>
      </div>

      <label class="dev-panel__label" for="dev-error-scenario">Scenario</label>
      <select id="dev-error-scenario" v-model="selectedScenarioKey" class="dev-panel__select">
        <option v-for="(scenario, key) in ERROR_SCENARIOS" :key="key" :value="key">
          {{ scenario.label }}
        </option>
      </select>

      <button type="button" class="dev-panel__button" @click="reload">Reload data</button>
    </div>
  </div>
</template>

<style scoped>
.dev-panel-root {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
}

.dev-panel__trigger {
  padding: 8px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #e0e0e0;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 999px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 40%);
  cursor: pointer;
}

.dev-panel__trigger:hover {
  background: #2a2a2a;
}

.dev-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 40%);
  color: #e0e0e0;
}

.dev-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dev-panel__title {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #aaa;
}

.dev-panel__close {
  padding: 0 4px;
  font-size: 1rem;
  line-height: 1;
  color: #aaa;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.dev-panel__close:hover {
  color: #e0e0e0;
}

.dev-panel__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ccc;
}

.dev-panel__select {
  padding: 6px 8px;
  font-size: 0.75rem;
  color: #e0e0e0;
  background: #2a2a2a;
  border: 1px solid #555;
  border-radius: 6px;
}

.dev-panel__button {
  padding: 7px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: #009a49;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.dev-panel__button:hover {
  background: #007a3a;
}
</style>
