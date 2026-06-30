## ADDED Requirements

### Requirement: System reads API host from environment configuration
The system SHALL retrieve the backend API base URL from environment variables and use it for all HTTP requests.

#### Scenario: API host configured in environment
- **WHEN** application initializes
- **THEN** system reads API_HOST from environment configuration
- **THEN** system constructs full endpoint URLs using base URL

#### Scenario: API host not configured
- **WHEN** API_HOST environment variable is missing
- **THEN** system logs warning message
- **THEN** system falls back to default localhost URL or throws configuration error

### Requirement: System authenticates user via API
The system SHALL call the users endpoint to validate credentials and retrieve user data for authenticated sessions.

#### Scenario: Successful user authentication
- **WHEN** user submits login credentials
- **THEN** system sends POST request to /users/ with email and password
- **THEN** API returns user object with ID, name, email, and currency
- **THEN** system stores user ID for subsequent requests

#### Scenario: Authentication failure
- **WHEN** API returns 401 or 403 status
- **THEN** system displays authentication error message
- **THEN** system does not proceed to dashboard

### Requirement: System fetches transactions with filters
The system SHALL retrieve transactions from the API filtered by user ID, type, and date range.

#### Scenario: Fetch all user transactions for date range
- **WHEN** dashboard loads or date range changes
- **THEN** system calls GET /transactions/?user_id={id}
- **THEN** system filters results by date range on client side
- **THEN** system groups transactions by type and group

#### Scenario: Fetch income transactions only
- **WHEN** income card needs data
- **THEN** system calls GET /transactions/?user_id={id}&type=income
- **THEN** system processes response and calculates total

#### Scenario: Fetch expense transactions by group
- **WHEN** needs expense card needs data
- **THEN** system calls GET /transactions/?user_id={id}&type=expense
- **THEN** system filters results where category group is "needs"
- **THEN** system aggregates data for chart and list

### Requirement: System creates transactions via API
The system SHALL submit new transaction data to the API using the transactions endpoint.

#### Scenario: Create transaction successfully
- **WHEN** user saves new transaction in modal
- **THEN** system sends POST /transactions/ with user_id, type, category, amount, description, date
- **THEN** API returns created transaction with ID
- **THEN** system updates local data and refreshes dashboard

#### Scenario: API validation error on create
- **WHEN** API returns 400 with validation errors
- **THEN** system displays error messages in modal
- **THEN** system keeps modal open for correction

### Requirement: System updates transactions via API
The system SHALL modify existing transactions by sending updated data to the API.

#### Scenario: Update transaction successfully
- **WHEN** user edits transaction and saves
- **THEN** system sends PUT /transactions/{id} with updated fields
- **THEN** API returns updated transaction object
- **THEN** system updates local data and refreshes dashboard

#### Scenario: Update fails due to not found
- **WHEN** API returns 404 for transaction ID
- **THEN** system displays error "Transaction not found"
- **THEN** system refreshes dashboard to sync state

### Requirement: System deletes transactions via API
The system SHALL remove transactions by calling the delete endpoint.

#### Scenario: Delete transaction successfully
- **WHEN** user confirms transaction deletion
- **THEN** system sends DELETE /transactions/{id}
- **THEN** API returns success status
- **THEN** system removes transaction from local data and refreshes dashboard

#### Scenario: Delete fails due to server error
- **WHEN** API returns 500 or network error
- **THEN** system displays error message
- **THEN** system keeps transaction in list until successful deletion

### Requirement: System fetches categories with filters
The system SHALL retrieve available categories from the API filtered by type and group for transaction forms.

#### Scenario: Fetch categories for income
- **WHEN** user selects "income" type in transaction modal
- **THEN** system calls GET /categories/?type=income
- **THEN** system populates category dropdown with results

#### Scenario: Fetch categories for needs expenses
- **WHEN** user selects "expense" type and "needs" group
- **THEN** system calls GET /categories/?type=expense&group=needs
- **THEN** system populates category dropdown with filtered results

#### Scenario: Fetch categories for wants expenses
- **WHEN** user selects "expense" type and "wants" group
- **THEN** system calls GET /categories/?type=expense&group=wants
- **THEN** system populates category dropdown with filtered results

### Requirement: System handles API errors gracefully
The system SHALL catch and handle HTTP errors with user-friendly messages.

#### Scenario: Network connectivity error
- **WHEN** API request fails due to network issue
- **THEN** system displays "Unable to connect to server" message
- **THEN** system logs error details for debugging

#### Scenario: API timeout
- **WHEN** API request exceeds timeout threshold
- **THEN** system cancels request
- **THEN** system displays timeout error message
- **THEN** system allows user to retry

#### Scenario: Unexpected API response format
- **WHEN** API returns data not matching expected TypeScript interface
- **THEN** system logs validation error
- **THEN** system displays generic error to user
- **THEN** system does not crash or display undefined values
