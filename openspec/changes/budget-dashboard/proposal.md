## Why

Users need a comprehensive budget management dashboard to track income, savings, and expenses with visual insights. The application requires both authenticated user sessions (with API persistence) and demo mode (local storage only) to allow users to try the feature before committing to registration.

## What Changes

- Create a budget dashboard component with time range filtering (week, month, year)
- Add visual data representation with pie charts for expense breakdown (needs vs wants)
- Implement transaction list components with inline creation via modals
- Create authentication mode selection screen (login vs demo mode)
- Integrate with existing backend API for users, transactions, and categories
- Implement local browser storage for demo mode operation
- Add income, savings, and expense tracking cards with real-time updates
- Ensure UI consistency with existing application theme

## Capabilities

### New Capabilities
- `auth-mode-selection`: Screen to choose between authenticated login or demo mode before accessing the dashboard
- `budget-dashboard-ui`: Main dashboard interface with header controls, three-column grid layout, and interactive cards
- `transaction-management`: Create, read, update, and delete transactions through modal dialogs and list views
- `api-integration`: Service layer to connect with backend API endpoints for users, transactions, and categories
- `demo-mode-storage`: Local browser storage implementation for demo sessions without API connectivity
- `data-visualization`: Pie charts and summary cards for income, savings, needs expenses, and wants expenses

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- New components under `src/app/components/features/budget-dashboard/`
- New services for API communication and storage management
- Environment variable configuration for API host URL
- New routing for auth selection and dashboard views
- Potential updates to app theme styles for dashboard consistency
- Integration with existing Angular modules and dependency injection
