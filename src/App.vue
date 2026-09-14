<script setup lang="ts">
import { ref } from 'vue'

import SignInForm from '@/components/SignInForm.vue'
import DashboardContainer from '@/views/DashboardContainer.vue'
import type { MockUser } from '@/mocks/authService'

const signedInUser = ref<MockUser | null>(null)
</script>

<template>
  <SignInForm v-if="!signedInUser" @signed-in="signedInUser = $event" />
  <DashboardContainer v-else />
</template>
