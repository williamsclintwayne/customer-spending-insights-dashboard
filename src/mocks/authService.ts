export interface MockUser {
  email: string
  name: string
}

export const demoAccounts = [
  {
    email: 'demo.user@spendwise.test',
    password: 'SpendWise2026!',
    name: 'Jordan Matthews',
  },
  {
    email: 'analyst@spendwise.test',
    password: 'Analyst2026!',
    name: 'Taylor Naidoo',
  },
  {
    email: 'manager@spendwise.test',
    password: 'Manager2026!',
    name: 'Samantha Jacobs',
  },
] as const

export const mockCredentials = {
  email: demoAccounts[0].email,
  password: demoAccounts[0].password,
}

/** A deliberately local-only auth adapter for the dashboard demo. */
export async function signInWithMock(email: string, password: string): Promise<MockUser> {
  await new Promise((resolve) => window.setTimeout(resolve, 350))

  const account = demoAccounts.find(
    (candidate) =>
      candidate.email === email.trim().toLowerCase() && candidate.password === password,
  )

  if (!account) {
    throw new Error('Incorrect email or password. Please try again.')
  }

  return { email: account.email, name: account.name }
}

export async function requestPasswordResetWithMock(email: string): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 250))

  const account = demoAccounts.find((candidate) => candidate.email === email.trim().toLowerCase())

  if (!account) {
    throw new Error('Enter a demo account email to request a password reset.')
  }
}
