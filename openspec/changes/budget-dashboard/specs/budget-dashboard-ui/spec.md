## ADDED Requirements

### Requirement: Dashboard displays header with time range controls
The system SHALL render a header containing a range type selector (week, month, year) and a calendar widget to specify the time period.

#### Scenario: User changes range type
- **WHEN** user selects "Month" from range selector
- **THEN** system updates calendar widget to month picker
- **THEN** system refreshes all dashboard data for selected month

#### Scenario: User selects specific date range
- **WHEN** user picks a date from calendar
- **THEN** system calculates appropriate range based on range type
- **THEN** system updates all cards and charts with data for that range

#### Scenario: Default time range on load
- **WHEN** dashboard loads for the first time
- **THEN** system defaults to current month
- **THEN** system displays current month in calendar widget

### Requirement: Dashboard displays three-column grid layout
The system SHALL organize dashboard cards in a three-column vertical grid structure that is responsive to screen width.

#### Scenario: Desktop view
- **WHEN** dashboard renders on screen width >= 1024px
- **THEN** system displays three equal-width columns
- **THEN** each column contains its designated cards stacked vertically

#### Scenario: Tablet view
- **WHEN** dashboard renders on screen width between 768px and 1023px
- **THEN** system displays two columns with third column wrapping below
- **THEN** system maintains card proportions

#### Scenario: Mobile view
- **WHEN** dashboard renders on screen width < 768px
- **THEN** system displays single column layout
- **THEN** cards stack vertically in logical order

### Requirement: Section 1 displays income and savings cards
The system SHALL render two cards in the first column showing total income and total savings for the selected time range.

#### Scenario: Income card displays total
- **WHEN** dashboard loads with selected time range
- **THEN** system fetches all income transactions for range
- **THEN** system calculates and displays total income amount
- **THEN** system shows currency symbol based on user settings

#### Scenario: Savings card displays total
- **WHEN** dashboard loads with selected time range
- **THEN** system fetches all saving transactions for range
- **THEN** system calculates and displays total savings amount
- **THEN** system shows currency symbol based on user settings

### Requirement: Section 2 displays needs expenses with pie chart and list
The system SHALL render a pie chart card showing needs expense breakdown and a transaction list card below it in the second column.

#### Scenario: Pie chart shows category breakdown
- **WHEN** needs expense data is available
- **THEN** system groups transactions by category
- **THEN** system renders pie chart with category segments
- **THEN** system displays category names and percentages

#### Scenario: Empty state for no needs expenses
- **WHEN** no needs expense transactions exist for range
- **THEN** system displays empty state message
- **THEN** system shows placeholder graphic or text

#### Scenario: List displays needs transactions
- **WHEN** needs expense transactions exist
- **THEN** system displays list with date, category, description, and amount
- **THEN** system orders transactions by date descending

### Requirement: Section 3 displays wants expenses with pie chart and list
The system SHALL render a pie chart card showing wants expense breakdown and a transaction list card below it in the third column.

#### Scenario: Pie chart shows category breakdown
- **WHEN** wants expense data is available
- **THEN** system groups transactions by category
- **THEN** system renders pie chart with category segments
- **THEN** system displays category names and percentages

#### Scenario: Empty state for no wants expenses
- **WHEN** no wants expense transactions exist for range
- **THEN** system displays empty state message
- **THEN** system shows placeholder graphic or text

#### Scenario: List displays wants transactions
- **WHEN** wants expense transactions exist
- **THEN** system displays list with date, category, description, and amount
- **THEN** system orders transactions by date descending

### Requirement: Dashboard reflects active mode visually
The system SHALL display a clear indicator of whether the user is in demo mode or authenticated mode.

#### Scenario: Demo mode indicator
- **WHEN** user is in demo mode
- **THEN** system displays "Demo Mode" badge in header
- **THEN** system uses distinct color or icon to differentiate

#### Scenario: Authenticated mode indicator
- **WHEN** user is authenticated
- **THEN** system displays user name or email in header
- **THEN** system shows logout option

### Requirement: Dashboard maintains consistent theme styling
The system SHALL apply existing application theme styles to all dashboard components.

#### Scenario: Theme colors applied
- **WHEN** dashboard renders
- **THEN** system uses theme primary, accent, and background colors
- **THEN** cards, headers, and buttons match existing component styles

#### Scenario: Theme changes reflected
- **WHEN** user changes application theme preference
- **THEN** dashboard updates all component styles accordingly
- **THEN** charts update color schemes to match theme
