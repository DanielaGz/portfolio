## 1. Project Setup and Dependencies

- [x] 1.1 Install Chart.js and ng2-charts packages
- [x] 1.2 Install Angular Material if not already present (for dialogs and date picker)
- [x] 1.3 Create budget-dashboard feature module structure under src/app/components/features/
- [x] 1.4 Add API_HOST environment variable to environment.ts and environment.prod.ts files
- [x] 1.5 Configure budget-dashboard module imports and exports

## 2. Storage Strategy Architecture

- [x] 2.1 Create StorageStrategy interface in shared/services/ with methods for transactions, categories, and user operations
- [x] 2.2 Implement ApiStorageStrategy service with HTTP client for all API endpoints
- [x] 2.3 Implement LocalStorageStrategy service for demo mode with localStorage operations
- [x] 2.4 Create storage provider service that selects active strategy based on mode
- [x] 2.5 Define TypeScript interfaces for User, Transaction, and Category matching API contracts

## 3. Authentication Mode Selection

- [x] 3.1 Create auth-mode-selection component with demo and login options
- [x] 3.2 Create login form component with email and password fields
- [x] 3.3 Implement authentication service with login method calling API users endpoint
- [x] 3.4 Add session persistence logic to remember mode selection in localStorage
- [x] 3.5 Create route guard to redirect unauthorized users to mode selection screen
- [x] 3.6 Add routing configuration for mode selection and login paths

## 4. API Integration Services

- [x] 4.1 Create users.service.ts with authentication and user profile methods
- [x] 4.2 Create transactions.service.ts with CRUD operations and filtering (user_id, type, date range)
- [x] 4.3 Create categories.service.ts with fetch methods filtered by type and group
- [x] 4.4 Implement HTTP error handling and user-friendly error messages
- [x] 4.5 Add request timeout configuration and retry logic
- [x] 4.6 Create TypeScript response validators to ensure API data matches expected interfaces

## 5. Demo Mode Storage Implementation

- [x] 5.1 Implement demo transaction CRUD methods in LocalStorageStrategy with client-side ID generation
- [x] 5.2 Create default demo categories for income, needs expenses, and wants expenses
- [x] 5.3 Initialize demo user profile with default name and currency on first use
- [x] 5.4 Add localStorage size monitoring and warning when approaching limits
- [x] 5.5 Implement clear demo data functionality with confirmation dialog
- [x] 5.6 Ensure demo storage methods return data matching API response format

## 6. Dashboard Layout and Header

- [x] 6.1 Create budget-dashboard-container component with responsive three-column grid layout
- [x] 6.2 Create dashboard-header component with mode indicator (demo badge or user name)
- [x] 6.3 Implement range type selector (week, month, year) in header
- [x] 6.4 Add calendar widget (Angular Material datepicker) for date range selection
- [x] 6.5 Create DateRangeService with BehaviorSubject for selected range and computed start/end dates
- [x] 6.6 Implement responsive breakpoints for desktop, tablet, and mobile layouts

## 7. Summary Cards (Income and Savings)

- [ ] 7.1 Create income-card component displaying total income for selected range
- [ ] 7.2 Create savings-card component displaying total savings for selected range
- [x] 7.3 Implement currency formatting service using user's currency preference
- [ ] 7.4 Add loading skeleton states for cards during data fetch
- [ ] 7.5 Calculate and display percentage change from previous period (optional trend indicator)
- [ ] 7.6 Style cards consistent with application theme

## 8. Expense Cards with Charts and Lists

- [ ] 8.1 Create expense-chart-card component accepting group parameter (needs/wants)
- [ ] 8.2 Integrate Chart.js pie chart with category breakdown data
- [ ] 8.3 Implement chart tooltips showing category name, amount, and percentage
- [ ] 8.4 Create expense-list-card component with transaction rows
- [ ] 8.5 Add (+) button in list card header that opens transaction modal
- [ ] 8.6 Display empty state message when no transactions exist for group
- [ ] 8.7 Format transaction list items with date, category, description, and formatted amount
- [ ] 8.8 Add delete action icon to transaction rows with confirmation

## 9. Data Visualization and Theming

- [ ] 9.1 Create chart color palette service that adapts to active theme
- [ ] 9.2 Implement theme subscription to update chart colors when theme changes
- [ ] 9.3 Ensure WCAG AA contrast ratios for chart segments and labels
- [ ] 9.4 Add smooth transitions for chart updates when data changes
- [x] 9.5 Format all amounts with thousand separators and proper decimal places by currency

## 10. Transaction Modal and Forms

- [ ] 10.1 Create transaction-modal component using Angular Material Dialog
- [ ] 10.2 Build transaction form with fields for type, category, amount, description, and date
- [ ] 10.3 Implement category dropdown filtering based on selected type and group
- [ ] 10.4 Add form validation for required fields, positive amounts, and valid dates
- [ ] 10.5 Create form submit handler that calls storage strategy create or update method
- [ ] 10.6 Add delete button in edit mode with confirmation dialog
- [ ] 10.7 Implement cancel/close modal functionality with unsaved changes warning
- [ ] 10.8 Pre-fill modal with transaction data when opened for editing from list
- [ ] 10.9 Pre-select type and group when modal opened from specific list's (+) button

## 11. Data Flow and State Management

- [x] 11.1 Create dashboard-state.service.ts with BehaviorSubjects for transactions, categories, and summary data
- [x] 11.2 Implement refresh logic that fetches data based on active storage strategy and date range
- [x] 11.3 Subscribe components to state observables for reactive updates
- [x] 11.4 Add loading state management with isLoading$ observable
- [x] 11.5 Implement error state handling with error$ observable and error display component

## 12. Routing and Navigation

- [x] 12.1 Update app.routes.ts with paths for mode selection, login, and dashboard
- [x] 12.2 Implement canActivate guard on dashboard route checking for valid session
- [x] 12.3 Add logout functionality that clears session and redirects to mode selection
- [ ] 12.4 Configure lazy loading for budget-dashboard feature module

## 13. Testing and Refinement

- [ ] 13.1 Test demo mode flow: selection → dashboard → CRUD operations → data persistence
- [ ] 13.2 Test authenticated mode flow: selection → login → API calls → dashboard
- [ ] 13.3 Verify time range filtering updates all cards and charts correctly
- [ ] 13.4 Test responsive layouts on desktop, tablet, and mobile screen sizes
- [ ] 13.5 Validate error handling for API failures and network issues
- [ ] 13.6 Test theme switching updates all components including charts
- [ ] 13.7 Verify form validation prevents invalid transaction submissions
- [ ] 13.8 Test localStorage clear functionality in demo mode
- [ ] 13.9 Check accessibility: keyboard navigation, screen reader compatibility, color contrast
- [ ] 13.10 Perform cross-browser testing (Chrome, Firefox, Safari, Edge)
