## ADDED Requirements

### Requirement: User can select authentication mode
The system SHALL present a mode selection screen before dashboard access that allows choosing between authenticated login and demo mode.

#### Scenario: User selects demo mode
- **WHEN** user clicks "Try Demo Mode" button
- **THEN** system navigates to dashboard without authentication
- **THEN** system sets storage strategy to local browser storage
- **THEN** system displays demo mode indicator in dashboard header

#### Scenario: User selects login mode
- **WHEN** user clicks "Login" button
- **THEN** system displays login form requesting email and password
- **THEN** system validates credentials against API

#### Scenario: User switches from selection screen
- **WHEN** user is on mode selection screen
- **THEN** system SHALL NOT allow direct navigation to dashboard
- **THEN** system redirects unauthorized access back to selection screen

### Requirement: System authenticates user credentials
The system SHALL validate user credentials through the API and establish authenticated session upon successful login.

#### Scenario: Successful authentication
- **WHEN** user submits valid email and password
- **THEN** system calls POST /users/ or equivalent auth endpoint
- **THEN** system stores user ID for subsequent API requests
- **THEN** system sets storage strategy to API mode
- **THEN** system navigates to dashboard

#### Scenario: Failed authentication
- **WHEN** user submits invalid credentials
- **THEN** system displays error message
- **THEN** system remains on login screen
- **THEN** system allows retry

### Requirement: Mode selection persists across browser sessions
The system SHALL remember the user's mode selection to avoid re-prompting on subsequent visits.

#### Scenario: Returning authenticated user
- **WHEN** user has active authenticated session
- **THEN** system bypasses mode selection screen
- **THEN** system navigates directly to dashboard

#### Scenario: Returning demo user
- **WHEN** user has active demo session
- **THEN** system bypasses mode selection screen
- **THEN** system navigates directly to dashboard with demo data

#### Scenario: New user or logged out
- **WHEN** user has no active session
- **THEN** system displays mode selection screen
- **THEN** system waits for mode selection
