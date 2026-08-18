# Architecture and Extension Guide

## Purpose

This repository is a client-side customer spending dashboard. It is currently a
working prototype: it visualizes generated transaction data in the browser and
does not connect to a production API, persist data, or identify users.

Use this document as the technical reference for maintaining the current
dashboard and adding new capabilities without bypassing its state and data
boundaries.

## Technology

| Concern                      | Choice                                                |
| ---------------------------- | ----------------------------------------------------- |
| UI                           | Vue 3 single-file components with the Composition API |
| Build and development server | Vite                                                  |
| Language                     | TypeScript                                            |
| Application state            | Pinia                                                 |
| Charts                       | Chart.js through vue-chartjs                          |
| Unit tests                   | Vitest and Vue Test Utils                             |
| Formatting and static checks | Prettier, ESLint, Oxlint, vue-tsc                     |

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

| Component           | Responsibility                                       |
| ------------------- | ---------------------------------------------------- |
| `DashboardHeader`   | Title and editable start/end date inputs             |
| `FilterBar`         | Category selection, quick periods, and reset control |
| `DashboardStatus`   | Loading, error, and no-results states                |
| `StatsCardsGrid`    | Total, average, and maximum spending summaries       |
| `SpendingChart`     | Doughnut-chart configuration and category summary    |
| `TransactionsTable` | Display, sorting events, and client-side pagination  |

Presentation-focused components such as `StatsCardsGrid`, `SpendingChart`, and
`TransactionsTable` receive typed props and emit interaction events where
appropriate. `DashboardHeader` and `FilterBar` currently interact directly
with the Pinia store for dashboard filter state.

The container and store retain orchestration and business-logic ownership, and
components should not duplicate filtering, aggregation, or service logic.

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

1. **Prototype-only data source.** Each load and retry generates a new
   client-side dataset. There is no production API, persistence,
   authentication, authorization, caching, or customer scope.

2. **External payload validation is still prototype-level.**
   `dataProcessor` validates the generated transaction model, but a real API
   integration should treat external payloads as `unknown` and validate them
   against a runtime schema before they enter application state.

### Medium priority

1. **Date input validation can be strengthened.** Store actions do not yet
   reject all invalid or reversed date ranges before updating state.

2. **Incomplete custom-period contract.** The Custom quick-period option is
   visible but not yet implemented as a complete custom-period workflow.
   `selectedTimePeriod` exists in the domain types but is not currently stored
   as application state.

3. **Mobile sorting discoverability.** The compact transaction-table layout
   hides the desktop table header, so sorting controls are less discoverable
   on smaller screens.

4. **Duplicate category definitions.** `spendingCategories` and
   `SPENDING_CATEGORIES` contain the same category values in separate modules.
   They should eventually be derived from one canonical definition.

### Lower priority

- `aria-sort` should ideally be associated with sortable table header cells
  rather than relying primarily on button state.
- Repeated date parsing and client-side sorting are appropriate for the current
  120-record mock dataset but should be reconsidered for large production
  datasets.
- The Vitest configuration currently emits a non-blocking Vite warning about
  future native config loading.

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
   configuration. Define versioned request and response contracts before
   integrating real customer data.

2. Validate unknown API responses at the service boundary using a runtime
   schema and reject malformed records before they reach Pinia.

3. Add resilient request handling such as cancellation or request identifiers
   to prevent stale responses from replacing newer state.

4. Strengthen date-range validation, complete the custom-period workflow,
   consolidate category definitions, and improve mobile sorting accessibility.

5. Expand automated coverage with component and integration tests for loading,
   error, retry, filter, chart, and full dashboard flows.

6. Add authentication, authorization, server-side pagination/filtering, audit
   requirements, and privacy controls when integrating real customer data.

7. Add production monitoring, error reporting, and performance measurements
   while ensuring transaction or customer-identifying information is never
   written to client logs.

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
