<script setup lang="ts">
import { ref } from 'vue'

import {
  demoAccounts,
  requestPasswordResetWithMock,
  signInWithMock,
  type MockUser,
} from '@/mocks/authService'

const emit = defineEmits<{
  signedIn: [user: MockUser]
}>()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const resetMessage = ref('')
const isSubmitting = ref(false)
const isRequestingReset = ref(false)
const areDemoAccountsVisible = ref(false)

async function submit() {
  errorMessage.value = ''
  resetMessage.value = ''
  isSubmitting.value = true

  try {
    const user = await signInWithMock(email.value, password.value)
    emit('signedIn', user)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to sign in. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

async function requestPasswordReset() {
  errorMessage.value = ''
  resetMessage.value = ''
  isRequestingReset.value = true

  try {
    await requestPasswordResetWithMock(email.value)
    resetMessage.value = 'Password reset link sent. Check your demo inbox.'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to request a password reset.'
  } finally {
    isRequestingReset.value = false
  }
}

function useDemoCredentials(account: (typeof demoAccounts)[number]) {
  email.value = account.email
  password.value = account.password
  errorMessage.value = ''
  resetMessage.value = ''
}
</script>

<template>
  <main class="sign-in-page">
    <section class="sign-in-card" aria-labelledby="sign-in-title">
      <p class="sign-in-card__eyebrow">Spendwise</p>
      <h1 id="sign-in-title">Welcome back</h1>
      <p class="sign-in-card__intro">Sign in to explore your customer spending insights.</p>

      <form @submit.prevent="submit">
        <label>
          <span>Email address</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@company.com"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <button
          v-if="errorMessage"
          type="button"
          class="forgot-password"
          :disabled="isRequestingReset"
          @click="requestPasswordReset"
        >
          {{ isRequestingReset ? 'Sending reset link…' : 'Forgot password?' }}
        </button>

        <p v-if="errorMessage" class="sign-in-card__error" role="alert">{{ errorMessage }}</p>
        <p v-if="resetMessage" class="sign-in-card__success" role="status">{{ resetMessage }}</p>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <div class="demo-accounts">
        <div class="demo-accounts__header">
          <strong>Demo accounts</strong>
          <button
            type="button"
            class="demo-accounts__toggle"
            :aria-expanded="areDemoAccountsVisible"
            aria-controls="demo-account-list"
            @click="areDemoAccountsVisible = !areDemoAccountsVisible"
          >
            {{ areDemoAccountsVisible ? 'Hide accounts' : 'Show accounts' }}
          </button>
        </div>

        <div v-if="areDemoAccountsVisible" id="demo-account-list" class="demo-accounts__list">
          <button
            v-for="account in demoAccounts"
            :key="account.email"
            type="button"
            class="demo-account"
            @click="useDemoCredentials(account)"
          >
            <span>
              <b>{{ account.name }}</b>
              {{ account.email }} · {{ account.password }}
            </span>
            <em>Use account</em>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.sign-in-page {
  display: grid;
  min-height: 100vh;
  padding: 24px;
  place-items: center;
  background:
    radial-gradient(circle at 18% 12%, rgb(0 154 73 / 16%), transparent 26rem),
    var(--color-background);
}

.sign-in-card {
  width: min(100%, 440px);
  padding: clamp(28px, 6vw, 44px);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
}

.sign-in-card__eyebrow {
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 8vw, 2.6rem);
}

.sign-in-card__intro {
  margin: 12px 0 28px;
  color: var(--color-text-muted);
  line-height: 1.55;
}

form,
label {
  display: grid;
  gap: 8px;
}
form {
  gap: 18px;
}

label span {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 11px 12px;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

button {
  border: 0;
  border-radius: 10px;
  color: white;
  background: var(--color-primary);
  font-weight: 700;
}

button:hover:not(:disabled) {
  background: var(--color-primary-dark);
}
button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.sign-in-card__error {
  margin: -4px 0 0;
  color: var(--color-danger);
  font-size: 0.9rem;
}
.sign-in-card__success {
  margin: -4px 0 0;
  color: var(--color-primary-dark);
  font-size: 0.9rem;
}

.forgot-password {
  justify-self: start;
  min-height: auto;
  padding: 0;
  color: var(--color-primary-dark);
  background: transparent;
  font-size: 0.88rem;
  text-decoration: underline;
}

.forgot-password:hover:not(:disabled) {
  color: var(--color-primary-dark);
  background: transparent;
}

.demo-accounts {
  display: grid;
  gap: 8px;
  margin-top: 28px;
  padding: 14px;
  background: var(--color-primary-soft);
  border-radius: 12px;
}

.demo-accounts > strong {
  font-size: 0.86rem;
}

.demo-accounts__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.demo-accounts__header strong {
  font-size: 0.86rem;
}

.demo-accounts__toggle {
  min-height: auto;
  padding: 0;
  color: var(--color-primary-dark);
  background: transparent;
  font-size: 0.8rem;
  text-decoration: underline;
}

.demo-accounts__toggle:hover {
  color: var(--color-primary-dark);
  background: transparent;
}

.demo-accounts__list {
  display: grid;
  gap: 8px;
}

.demo-account {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 8px 10px;
  color: var(--color-primary-dark);
  text-align: left;
  background: rgb(255 255 255 / 65%);
  border: 1px solid rgb(0 120 58 / 20%);
}

.demo-account span {
  display: grid;
  gap: 2px;
  color: var(--color-text-muted);
  font-size: 0.72rem;
}
.demo-account b {
  color: var(--color-text);
  font-size: 0.82rem;
}
.demo-account em {
  flex: 0 0 auto;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}
.demo-account:hover {
  color: white;
  background: var(--color-primary-dark);
}
.demo-account:hover span,
.demo-account:hover b {
  color: white;
}
</style>
