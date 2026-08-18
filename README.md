# Customer Spending Insights Dashboard

A production-grade responsive financial analytics dashboard built with Vue 3, TypeScript, Pinia, Vite, Chart.js, and Vitest.

The project demonstrates frontend engineering practices including component architecture, state management, strict typing, reusable utilities, automated testing, responsive design, accessibility considerations, Docker-based production deployment, and continuous integration.

## Features

- Financial spending overview dashboard
- Mock transaction data covering the previous 90 days
- Category filtering
- Date-range filtering
- Quick date filters
- Total spending calculation
- Average transaction calculation
- Maximum transaction calculation
- Spending breakdown by category
- Responsive doughnut chart
- Sortable transactions table
- Client-side pagination
- Loading state
- Empty state
- Error state
- Responsive mobile, tablet, laptop, and desktop layouts
- South African Rand currency formatting
- Accessible labels and keyboard-friendly controls

## Technology Stack

- Vue 3
- Composition API
- TypeScript
- Pinia
- Vite
- Chart.js
- vue-chartjs
- Vitest
- Vue Test Utils
- ESLint
- Oxlint
- Prettier
- Docker
- Nginx
- GitHub Actions

## Architecture

The application follows a layered frontend architecture.

```text
src/
├── components/
│   ├── DashboardHeader.vue
│   ├── DashboardStatus.vue
│   ├── FilterBar.vue
│   ├── SpendingChart.vue
│   ├── StatsCardsGrid.vue
│   └── TransactionsTable.vue
│
├── mocks/
│   └── spendingDataGenerator.ts
│
├── services/
│   ├── dataProcessor.ts
│   └── spendingDataService.ts
│
├── stores/
│   └── dashboard.ts
│
├── styles/
│   └── main.css
│
├── types/
│   ├── dashboard.ts
│   ├── transaction.ts
│   └── index.ts
│
├── utils/
│   ├── aggregators.ts
│   ├── chartData.ts
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── index.ts
│
└── views/
    └── DashboardContainer.vue
```

For more detail, see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Requirements

Install the following before running the project locally:

- Node.js 22
- npm
- Git

Docker Desktop is required to run the production container locally.

## Local Development

Clone the repository:

```bash
git clone https://github.com/williamsclintwayne/customer-spending-insights-dashboard.git
```

Enter the project directory:

```bash
cd customer-spending-insights-dashboard
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

## Available Scripts

Start development:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Format source files:

```bash
npm run format
```

Run unit tests:

```bash
npm run test:unit -- --run
```

Create a production build:

```bash
npm run build
```

## Testing

The project uses Vitest and Vue Test Utils.

The current automated test suite covers:

- validators
- date validation
- amount validation
- currency formatting
- date formatting
- spending aggregation
- category grouping
- chart-data transformation
- mock transaction generation
- spending data service behaviour
- Pinia store filtering
- Pinia store sorting
- dashboard metrics
- transaction pagination
- transaction sorting
- transaction empty state
- application rendering

All tests should pass before a change is merged.

## Docker

The project uses a multi-stage Docker build.

The first stage builds the Vue application using Node.js.

The final stage serves the compiled application using Nginx.

Build the image:

```bash
docker build -t customer-spending-dashboard .
```

Run the container:

```bash
docker run --rm -p 3000:3000 --name spending-dashboard customer-spending-dashboard
```

Open the production application at:

```text
http://localhost:3000
```

## Continuous Integration

GitHub Actions is configured in:

```text
.github/workflows/ci.yml
```

The workflow runs on pushes and pull requests targeting:

- `main`
- `develop`

The CI pipeline performs:

1. Dependency installation
2. Linting
3. Unit testing
4. Production build validation

This helps prevent broken or low-quality changes from being merged.

## Responsive Design

The dashboard targets the following viewport widths:

- 375px — mobile
- 768px — tablet
- 1024px — laptop
- 1440px — desktop

The transactions table changes to a mobile-friendly card layout at smaller widths.

## State Management

Pinia is used for application-level dashboard state through `useDashboardStore`.

The store manages:

- spending data
- selected category
- selected date range
- sorting state
- loading state
- error state

It also exposes derived state for:

- filtered spending
- total spending
- average spending
- maximum spending
- category totals
- sorted transactions

## Data Layer

The project uses locally generated mock transaction data.

`spendingDataService` simulates an asynchronous API request.

`dataProcessor` validates and normalizes transaction data before the information enters application state.

This keeps the UI independent from the underlying data source and provides a clear migration path to a real backend API.

## Key Design Decisions

### Strict TypeScript

Shared domain models are defined in `src/types`.

The project avoids `any` and uses explicit types throughout the application.

### ZAR Currency

Financial values are formatted using the South African locale and South African Rand.

### Local Date Handling

Calendar dates are handled as local dates rather than relying on UTC conversion.

This avoids timezone-related date shifts.

### Separation of Concerns

Responsibilities are separated between:

- components
- stores
- services
- utilities
- domain types
- mock data generation

### Computed State

Derived values are calculated through computed state rather than duplicated into separate mutable state.

### Chart Transformation

Chart-data transformation is kept separate from the Vue component so that the transformation logic can be unit tested independently.

### Local Pagination State

Pagination is kept inside the transactions component because it represents presentation state rather than application-level domain state.

## Branching Strategy

Development uses a feature-branch workflow.

```text
main
└── develop
    ├── feature/project-architecture
    ├── feature/dashboard-utilities
    ├── feature/mock-spending-data
    ├── feature/dashboard-store
    ├── feature/dashboard-layout
    ├── feature/spending-chart
    ├── feature/transactions-table
    └── feature/project-hardening
```

Feature branches are merged into `develop` through pull requests.

The stable application is promoted from `develop` into `main`.

## Project Status

Core dashboard functionality is complete.

Current work focuses on:

- production hardening
- CI validation
- documentation
- accessibility review
- final quality assurance
