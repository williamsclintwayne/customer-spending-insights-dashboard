<script setup lang="ts">
import { ref } from 'vue'

import SignInForm from '@/components/SignInForm.vue'
import DashboardContainer from '@/views/DashboardContainer.vue'
import type { MockUser } from '@/mocks/authService'

const signedInUser = ref<MockUser | null>(null)
</script>

<template>
  <Transition name="fade" mode="out-in">
    <SignInForm v-if="!signedInUser" key="sign-in" @signed-in="signedInUser = $event" />
    <DashboardContainer v-else key="dashboard" @sign-out="signedInUser = null" />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
