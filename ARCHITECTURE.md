# Architecture and Extension Guide

## Purpose

This repository is a client-side customer spending dashboard. It is currently a
working prototype: it visualizes generated transaction data in the browser and
does not connect to a production API, persist data, or identify users.

Use this document as the technical reference for maintaining the current
dashboard and adding new capabilities without bypassing its state and data
boundaries.

## Technology

| Concern | Choice |
| --- | --- |
| UI | Vue 3 single-file components with the Composition API |
| Build and development server | Vite |
| Language | TypeScript |
| Application state | Pinia |
| Charts | Chart.js through vue-chartjs |
| Unit tests | Vitest and Vue Test Utils |
| Formatting and static checks | Prettier, ESLint, Oxlint, vue-tsc |

The supported Node.js versions are declared in `package.json`. The standard
commands are `npm run dev`, `npm run build`, `npm run type-check`, and
`npm run test:unit`.

## System Shape

```text
main.ts
  -> App.vue
    -> DashboardContainer.vue
      -> dashboard Pinia store
        -> spendingDataService
          -> mock spending-data generator
          -> data processor and validation
      -> header, filters, status, stats, chart, and transactions components
```

### Application entry points

- `src/main.ts` creates the Vue app, installs Pinia, imports global styles, and
  mounts `App.vue`.
- `src/App.vue` deliberately contains only the dashboard view. There is no
  router or multi-page application shell.
- `src/views/DashboardContainer.vue` coordinates data loading and selects the
  loading, error, empty, or populated dashboard state.

### State and derived data

`src/stores/dashboard.ts` is the single source of truth for dashboard state.
It owns:

- raw `spendingData` transactions;
- selected date range and category;
- table sort field and direction;
- loading and error state;
- actions to fetch data, update filters and sorting, and reset filters.

It also owns all dashboard-derived values: filtered transactions, total,
average, maximum, category totals, and sorted transactions. Components should
consume these values and request changes through store actions; they should not
repeat filtering, aggregation, or data-fetching logic locally.

### Data boundary

`src/services/spendingDataService.ts` is the application data boundary. Today
it waits briefly, generates 120 random records in
`src/mocks/spendingDataGenerator.ts`, and filters them through
`src/services/dataProcessor.ts`.

The transaction domain model is defined in `src/types/transaction.ts`:

```ts
interface Transaction {
  id: string
  date: string // YYYY-MM-DD
  amount: number
  category: SpendingCategory
  description: string
  merchant?: string
}
```

Date ranges, filter concepts, and table sorting types live in
`src/types/dashboard.ts`. Shared category constants, numerical aggregations,
formatters, validation helpers, and chart-data construction live in `src/utils`.

### Rendering responsibilities

| Component | Responsibility |
| --- | --- |
| `DashboardHeader` | Title and editable start/end date inputs |
| `FilterBar` | Category selection, quick periods, and reset control |
| `DashboardStatus` | Loading, error, and no-results states |
| `StatsCardsGrid` | Total, average, and maximum spending summaries |
| `SpendingChart` | Doughnut-chart configuration and category summary |
| `TransactionsTable` | Display, sorting events, and client-side pagination |

Components receive typed props and emit user intent upward. The container and
store retain orchestration and business logic ownership.

## Runtime Behavior

1. `DashboardContainer` mounts and invokes `dashboardStore.fetchSpendingData()`.
2. The store marks itself loading, obtains transactions from the data service,
   and exposes a readable error when that operation fails.
3. Derived store values filter records by the selected inclusive date range and
   category, then calculate the metrics, chart totals, and sorted table data.
4. A filter, date range, or sorting change updates store state; Vue recomputes
   and redraws only the affected derived values and components.
5. The table pages the already filtered and sorted results using the shared page
   size constant.

All money is formatted as South African rand using `en-ZA`. Transaction dates
are treated as local calendar dates by appending a local midnight time before
comparison or display.

## Current Limitations and Risks

### High priority

1. **Prototype-only data source.** Each load and retry generates a different,
   random client-side dataset. There is no API contract, persistence,
   authentication, authorization, cancellation, caching, or customer scope.
2. **Unsafe production data validation.** The current data processor accepts a
   TypeScript `Transaction`, rather than an unknown external payload. It does
   not verify a supported category, can normalize invalid calendar dates, and
   can throw for malformed non-object API records.
3. **Misleading test success signal.** A recent `npm run test:unit -- --run`
   execution reported three passing files but seven Vitest worker-start errors,
   while the command exited with code zero. Treat the suite as incomplete until
   worker startup is reliable and the command fails on these errors.

### Medium priority

1. **Date input edge case.** Clearing a date input is parsed into an unintended
   historical JavaScript date. Store actions also do not validate that a date
   range contains two valid dates in ascending order.
2. **Incomplete period filter contract.** The Custom quick-period option is
   visible but disabled. `selectedTimePeriod` exists in types but is not stored
   or reflected in the UI, so active quick-period selection has no state.
3. **Desktop layout selector mismatch.** The desktop two-column CSS targets
   `.dashboard-placeholder-grid`, but the rendered element uses
   `.dashboard-content-grid`; chart and table therefore remain single-column.
4. **Mobile table sorting is not visually available.** Sorting controls are in
   the header, which is visually hidden in the compact table presentation.
5. **Duplicate category source of truth.** `spendingCategories` and
   `SPENDING_CATEGORIES` contain the same values in different modules and can
   diverge when categories are changed.

### Lower priority

- `SortField` supports `category`, but the current table has no category sort
  control or store comparison logic for it.
- `aria-sort` is applied to buttons rather than the table header cells, which
  weakens table-sort semantics for assistive technology.
- `DashboardContainer` wraps the already framed `TransactionsTable` in another
  framed article, creating redundant layout and heading structure.
- Repeated date parsing and sorting are acceptable for 120 mock records but
  should be reconsidered for large datasets.

## Adding Features

Use the following workflow for new dashboard features.

1. **Define the domain contract first.** Add or extend types in `src/types`.
   Keep a single canonical source for enums and category values.
2. **Place external I/O in a service.** A component must not call `fetch`, read
   storage, or parse API payloads directly. Services return validated domain
   values or typed errors.
3. **Add shared state and derivations to Pinia.** Put cross-component state,
   filter state, async status, and derived business data in `dashboard.ts` or a
   dedicated feature store. Keep derivations pure and testable.
4. **Keep components focused on presentation and interaction.** Pass state in
   through props; emit typed events for changes. Use the container to connect a
   component to the store where that coupling is appropriate.
5. **Use utilities for reusable pure logic.** Aggregations, mapping, parsing,
   and formatting belong in `src/utils` or `src/services/dataProcessor.ts`, not
   in templates.
6. **Add focused tests with the feature.** Cover pure helpers, store behavior,
   async failures, and component interactions. Add responsive and accessibility
   coverage for tables, filters, and charts when their behavior changes.
7. **Check loading, error, empty, and reset behavior.** Every feature that
   depends on data must define its behavior for each state, including retries
   and rapid repeated requests.

### Examples

- A new chart: add its aggregation as a store computed value, create a focused
  chart component, and test the aggregation and empty-data state.
- A new filter: add a typed filter field and action in the store, include it in
  the filtered-data computed value, expose it through `FilterBar`, and test
  filtering plus reset behavior.
- A new API field: validate it at the service boundary, extend `Transaction` or
  a related type, and update only consumers that need it.
- A new page: introduce Vue Router and a page-level view; do not turn `App.vue`
  into a large conditionally rendered router substitute.

## Suggested Production Roadmap

1. Replace the mock service with an API adapter and environment-based endpoint
   configuration. Define versioned request/response contracts and customer
   scoping before integrating UI behavior.
2. Validate unknown API responses at the boundary with a runtime schema. Reject
   malformed records with useful observability and never pass unvalidated data
   to the store.
3. Make loading resilient: use request cancellation or request IDs to prevent
   stale responses overwriting newer data, and provide retry behavior that does
   not silently change the business dataset.
4. Fix the date validation, quick-period state, desktop grid selector, mobile
   sorting controls, category source duplication, and table accessibility
   semantics before broader feature work.
5. Repair the Vitest worker configuration or CI environment so all discovered
   tests execute and worker failures fail the command. Add integration coverage
   for loading, error, filter, table, and chart flows.
6. Add authentication, authorization, server-side pagination/filtering, audit
   needs, and privacy controls according to the real customer-data requirements.
7. Add client/server error monitoring and performance measurements once the API
   is live. Avoid logging transaction details or customer-identifying data.

## Change Checklist

Before merging a feature, confirm:

- it has a typed domain and validated external data boundary;
- state ownership and component responsibilities remain clear;
- empty, loading, error, and retry behavior are intentional;
- mobile keyboard and assistive-technology interaction still work;
- relevant unit tests are added and the complete suite genuinely executes;
- `npm run type-check` and `npm run build` pass;
- no sensitive transaction or customer data is exposed in client logs, fixtures,
  or error messages.
