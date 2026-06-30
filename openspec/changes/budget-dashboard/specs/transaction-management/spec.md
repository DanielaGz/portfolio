## ADDED Requirements

### Requirement: List cards display add transaction button
The system SHALL render a (+) button in the header of each transaction list card (needs expenses, wants expenses).

#### Scenario: User clicks add button on needs expense list
- **WHEN** user clicks (+) button on needs expense card
- **THEN** system opens transaction modal
- **THEN** system pre-selects type as "expense" and group as "needs"

#### Scenario: User clicks add button on wants expense list
- **WHEN** user clicks (+) button on wants expense card
- **THEN** system opens transaction modal
- **THEN** system pre-selects type as "expense" and group as "wants"

### Requirement: Transaction modal allows creating new transactions
The system SHALL display a modal dialog with form fields to create income, expense, or saving transactions.

#### Scenario: User creates new transaction with all fields
- **WHEN** user fills type, category, amount, description, and date
- **THEN** user clicks "Save" button
- **THEN** system validates all required fields are present
- **THEN** system calls storage strategy to persist transaction
- **THEN** system closes modal and refreshes dashboard data

#### Scenario: User submits invalid transaction data
- **WHEN** user submits form with missing required fields
- **THEN** system displays validation error messages
- **THEN** system keeps modal open for correction
- **THEN** system highlights invalid fields

#### Scenario: User cancels transaction creation
- **WHEN** user clicks "Cancel" or outside modal
- **THEN** system closes modal without saving
- **THEN** system discards form data
- **THEN** dashboard data remains unchanged

### Requirement: Modal provides category selection based on transaction type
The system SHALL filter available categories based on the selected transaction type and expense group if applicable.

#### Scenario: User selects income type
- **WHEN** user selects "income" as transaction type
- **THEN** system displays only income categories from categories endpoint
- **THEN** system hides expense group field

#### Scenario: User selects expense type with needs group
- **WHEN** user selects "expense" type and "needs" group
- **THEN** system displays only expense categories with group "needs"
- **THEN** system fetches filtered categories from storage

#### Scenario: User selects saving type
- **WHEN** user selects "saving" as transaction type
- **THEN** system displays saving categories
- **THEN** system hides expense group field

### Requirement: Transactions can be edited from list view
The system SHALL allow users to click on a transaction in any list to open edit modal with pre-filled data.

#### Scenario: User edits existing transaction
- **WHEN** user clicks on transaction row in list
- **THEN** system opens transaction modal with existing values
- **THEN** user modifies one or more fields
- **THEN** user clicks "Save"
- **THEN** system updates transaction via storage strategy
- **THEN** system refreshes dashboard data

#### Scenario: User views transaction details read-only
- **WHEN** transaction modal opens for editing
- **THEN** system displays all transaction fields
- **THEN** system shows transaction ID (hidden from user, used for updates)
- **THEN** user can modify editable fields

### Requirement: Transactions can be deleted from list view or modal
The system SHALL provide a delete option for transactions accessible from the list or edit modal.

#### Scenario: User deletes transaction from modal
- **WHEN** user opens transaction edit modal
- **THEN** user clicks "Delete" button
- **THEN** system displays confirmation dialog
- **THEN** user confirms deletion
- **THEN** system calls storage strategy delete method
- **THEN** system closes modal and refreshes dashboard

#### Scenario: User cancels deletion
- **WHEN** user clicks "Delete" and sees confirmation
- **THEN** user clicks "Cancel" on confirmation
- **THEN** system closes confirmation dialog
- **THEN** transaction remains in list and modal stays open

#### Scenario: User deletes transaction from list action
- **WHEN** user clicks delete icon on transaction row
- **THEN** system displays confirmation dialog
- **THEN** user confirms deletion
- **THEN** system removes transaction and refreshes list

### Requirement: Transaction form validates input data
The system SHALL enforce validation rules on all transaction form fields before submission.

#### Scenario: Amount field validates positive numbers
- **WHEN** user enters negative or zero amount
- **THEN** system displays error "Amount must be greater than zero"
- **THEN** system prevents form submission

#### Scenario: Date field validates format and range
- **WHEN** user enters invalid date format or future date
- **THEN** system displays error message
- **THEN** system prevents form submission

#### Scenario: Required fields validation
- **WHEN** user leaves type, category, amount, or date empty
- **THEN** system displays "This field is required" message
- **THEN** system prevents form submission
