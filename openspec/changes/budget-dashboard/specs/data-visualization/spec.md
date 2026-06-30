## ADDED Requirements

### Requirement: System renders pie charts for expense category breakdown
The system SHALL display pie charts showing the distribution of expenses by category for both needs and wants groups.

#### Scenario: Pie chart displays category segments
- **WHEN** expense data for selected time range is available
- **THEN** system groups transactions by category
- **THEN** system calculates total amount per category
- **THEN** system renders pie chart with segment per category
- **THEN** each segment displays category name and percentage

#### Scenario: Pie chart uses category colors
- **WHEN** categories have defined colors or icons
- **THEN** system assigns distinct colors to each segment
- **THEN** colors remain consistent across chart renders

#### Scenario: Empty chart state
- **WHEN** no transactions exist for expense group in time range
- **THEN** system displays empty state message instead of chart
- **THEN** message reads "No expenses in this category yet"

### Requirement: Charts display tooltips on hover
The system SHALL show detailed information when user hovers over chart segments.

#### Scenario: User hovers over pie segment
- **WHEN** user moves cursor over chart segment
- **THEN** system displays tooltip with category name
- **THEN** tooltip shows exact amount and percentage
- **THEN** tooltip formats amount with currency symbol

#### Scenario: User moves away from segment
- **WHEN** user moves cursor outside segment
- **THEN** system hides tooltip
- **THEN** segment returns to normal state

### Requirement: Income card displays total with visual indicator
The system SHALL show total income for selected time range with clear visual representation.

#### Scenario: Income card shows amount
- **WHEN** dashboard loads with income data
- **THEN** system calculates sum of all income transactions
- **THEN** card displays total with large font size
- **THEN** card shows currency symbol matching user preference

#### Scenario: Income card shows comparison to previous period
- **WHEN** sufficient historical data exists
- **THEN** system calculates income for previous equivalent period
- **THEN** card displays percentage change indicator (up/down arrow)
- **THEN** positive change shows green, negative shows red

#### Scenario: Income card with no data
- **WHEN** no income transactions exist for range
- **THEN** card displays "0" with currency symbol
- **THEN** card shows neutral state without trend indicator

### Requirement: Savings card displays total with visual indicator
The system SHALL show total savings for selected time range with clear visual representation.

#### Scenario: Savings card shows amount
- **WHEN** dashboard loads with savings data
- **THEN** system calculates sum of all saving transactions
- **THEN** card displays total with large font size
- **THEN** card shows currency symbol matching user preference

#### Scenario: Savings card shows progress toward goal
- **WHEN** user has set savings goal (future enhancement placeholder)
- **THEN** card displays progress bar or percentage
- **THEN** card shows amount remaining to goal

#### Scenario: Savings card with no data
- **WHEN** no saving transactions exist for range
- **THEN** card displays "0" with currency symbol
- **THEN** card shows neutral state

### Requirement: Charts update automatically when data changes
The system SHALL refresh all visualizations when transactions are added, edited, or deleted.

#### Scenario: Transaction created from modal
- **WHEN** user saves new transaction
- **THEN** system closes modal and refreshes dashboard
- **THEN** affected chart or card updates with new data
- **THEN** totals recalculate immediately

#### Scenario: Transaction deleted from list
- **WHEN** user deletes transaction
- **THEN** system removes transaction and refreshes views
- **THEN** charts re-render excluding deleted transaction
- **THEN** category segments adjust proportions

#### Scenario: Time range filter changes
- **WHEN** user selects different date range
- **THEN** system fetches new data for range
- **THEN** all cards and charts update simultaneously
- **THEN** transitions are smooth without flicker

### Requirement: Charts apply theme colors and styling
The system SHALL render charts using the active application theme colors.

#### Scenario: Chart uses theme primary color
- **WHEN** dashboard renders in light theme
- **THEN** charts use light theme color palette
- **THEN** segment colors are distinguishable and accessible

#### Scenario: Chart updates with theme change
- **WHEN** user toggles theme from light to dark
- **THEN** charts re-render with dark theme colors
- **THEN** text labels and backgrounds adjust for readability

#### Scenario: Chart maintains WCAG contrast ratios
- **WHEN** charts render in any theme
- **THEN** system ensures segment colors meet WCAG AA contrast
- **THEN** tooltips and labels are readable

### Requirement: Transaction lists display formatted amounts
The system SHALL format transaction amounts with proper currency symbols and decimal places.

#### Scenario: List item shows transaction amount
- **WHEN** transaction list renders
- **THEN** each item displays amount with currency symbol prefix or suffix
- **THEN** amounts show two decimal places for currencies with subunits
- **THEN** large numbers include thousand separators

#### Scenario: Amount formatting matches user locale
- **WHEN** user has currency preference set
- **THEN** system formats amounts according to currency rules
- **THEN** Colombian Peso (COP) shows no decimals
- **THEN** US Dollar (USD) shows two decimals

### Requirement: Dashboard displays loading states during data fetch
The system SHALL show loading indicators while fetching or computing data.

#### Scenario: Initial dashboard load
- **WHEN** user navigates to dashboard
- **THEN** system displays skeleton loaders for cards and charts
- **THEN** loaders match card dimensions and layout
- **THEN** loaders disappear once data is rendered

#### Scenario: Time range filter change
- **WHEN** user changes date range
- **THEN** system shows loading spinner on affected cards
- **THEN** previous data remains visible until new data loads
- **THEN** spinner disappears when refresh completes
