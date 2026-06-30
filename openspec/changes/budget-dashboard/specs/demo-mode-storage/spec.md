## ADDED Requirements

### Requirement: System stores demo transactions in browser localStorage
The system SHALL persist all demo mode transactions in the browser's localStorage without making any API calls.

#### Scenario: Create transaction in demo mode
- **WHEN** user in demo mode creates new transaction
- **THEN** system generates unique client-side ID
- **THEN** system stores transaction in localStorage under key "demo_transactions"
- **THEN** system does not call API endpoints

#### Scenario: Retrieve transactions in demo mode
- **WHEN** dashboard loads in demo mode
- **THEN** system reads "demo_transactions" from localStorage
- **THEN** system parses JSON data into transaction objects
- **THEN** system applies filters and returns results

#### Scenario: Update transaction in demo mode
- **WHEN** user edits transaction in demo mode
- **THEN** system finds transaction by ID in localStorage array
- **THEN** system updates transaction fields
- **THEN** system saves updated array back to localStorage

#### Scenario: Delete transaction in demo mode
- **WHEN** user deletes transaction in demo mode
- **THEN** system removes transaction from localStorage array by ID
- **THEN** system saves modified array back to localStorage

### Requirement: System stores demo categories in browser localStorage
The system SHALL maintain a predefined set of categories in localStorage for demo mode users.

#### Scenario: Initialize demo categories on first use
- **WHEN** user enters demo mode for first time
- **THEN** system checks if "demo_categories" exists in localStorage
- **THEN** system creates default categories for income, needs, and wants if not present
- **THEN** system stores categories with ID, name, type, group, and icon

#### Scenario: Retrieve categories in demo mode
- **WHEN** transaction modal loads in demo mode
- **THEN** system reads "demo_categories" from localStorage
- **THEN** system filters categories by type and group as requested

### Requirement: System stores demo user profile in browser localStorage
The system SHALL persist a demo user profile with preferences in localStorage.

#### Scenario: Initialize demo user on first use
- **WHEN** user selects demo mode for first time
- **THEN** system creates demo user object with default name and currency
- **THEN** system stores user under "demo_user" in localStorage
- **THEN** system assigns demo user a client-generated ID

#### Scenario: Retrieve demo user data
- **WHEN** dashboard loads in demo mode
- **THEN** system reads "demo_user" from localStorage
- **THEN** system uses currency setting for amount formatting

### Requirement: System provides option to clear all demo data
The system SHALL allow users to reset demo mode by clearing all locally stored data.

#### Scenario: User clears demo data
- **WHEN** user clicks "Clear Demo Data" button
- **THEN** system displays confirmation dialog
- **THEN** user confirms action
- **THEN** system removes "demo_transactions", "demo_categories", and "demo_user" from localStorage
- **THEN** system refreshes dashboard showing empty state

#### Scenario: User cancels data clearing
- **WHEN** user clicks "Clear Demo Data" and sees confirmation
- **THEN** user clicks "Cancel"
- **THEN** system closes confirmation without deleting data

### Requirement: Demo mode operations mimic API response format
The system SHALL structure demo mode data returns to match API response interfaces for compatibility.

#### Scenario: Demo storage returns transaction list
- **WHEN** component requests transactions in demo mode
- **THEN** demo storage returns array of transaction objects with same structure as API
- **THEN** objects include id, user_id, type, category, amount, description, date fields

#### Scenario: Demo storage returns single transaction
- **WHEN** component requests transaction by ID in demo mode
- **THEN** demo storage returns single transaction object matching API format
- **THEN** returns null if ID not found

### Requirement: Demo mode enforces storage size limits
The system SHALL monitor localStorage usage and prevent exceeding browser limits.

#### Scenario: Demo data approaches storage limit
- **WHEN** adding new transaction would exceed 4MB in localStorage
- **THEN** system displays warning message
- **THEN** system suggests clearing old data
- **THEN** system prevents transaction creation until space available

#### Scenario: Normal demo usage
- **WHEN** demo data size is under threshold
- **THEN** system allows normal CRUD operations
- **THEN** system does not display warnings

### Requirement: Demo mode data persists across browser sessions
The system SHALL retain demo data in localStorage until explicitly cleared or browser storage is wiped.

#### Scenario: User closes and reopens browser
- **WHEN** user closes browser with demo data
- **THEN** user reopens browser and selects demo mode
- **THEN** system loads all previously created transactions and categories
- **THEN** dashboard displays same data as before close

#### Scenario: User switches to incognito mode
- **WHEN** user opens app in incognito/private browsing
- **THEN** system starts with empty demo storage
- **THEN** system creates new isolated demo session
