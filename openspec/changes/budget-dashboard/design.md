## Context

This change adds a budget management dashboard to an existing Angular portfolio application. The app already has a component-based architecture with routing, theming service, and a features module structure. The dashboard needs to support two distinct modes: authenticated API-backed sessions and offline demo sessions using browser storage.

The backend API provides endpoints for users, transactions, and categories with filtering capabilities. The API host will be configured via environment variables.

Current structure places features under `src/app/components/features/` with dedicated service folders for business logic.

## Goals / Non-Goals

**Goals:**
- Create a standalone feature module for the budget dashboard
- Support both authenticated and demo user modes with mode-agnostic component design
- Provide real-time visual feedback with charts and summary cards
- Enable inline transaction CRUD operations through modals
- Maintain visual consistency with existing application theme
- Implement time-range filtering (week, month, year) for all data views

**Non-Goals:**
- User registration/authentication implementation (assumes existing user session or demo flag)
- Backend API development (API endpoints already exist)
- Mobile-specific responsive optimization beyond standard responsive design
- Real-time synchronization or WebSocket integration
- Multi-currency conversion (uses user's configured currency from API)
- Advanced analytics or forecasting features

## Decisions

### Architecture Pattern: Feature Module with Lazy Loading
**Decision**: Implement budget dashboard as a standalone feature module with lazy-loaded routing.

**Rationale**: Follows existing pattern in the codebase (`features.module.ts`, `home.module.ts`). Enables code splitting and improves initial load performance.

**Alternatives Considered**: Standalone components (too new, requires Angular 14+), embedding in existing home module (violates separation of concerns).

### State Management: Service-Based with RxJS
**Decision**: Use Angular services with BehaviorSubject/Observable patterns for state management.

**Rationale**: Lightweight, follows existing service pattern in the app, sufficient for dashboard scope. No external state library needed.

**Alternatives Considered**: NgRx (too complex for this scope), signals (requires Angular 16+).

### Mode Detection: Abstract Storage Interface
**Decision**: Create a `StorageStrategy` interface with two implementations: `ApiStorageStrategy` and `LocalStorageStrategy`. Mode selection at auth screen sets the active strategy via dependency injection.

**Rationale**: Enables components to remain mode-agnostic. Single codebase for both modes. Easy to test and extend.

**Alternatives Considered**: Component-level conditionals (violates DRY, error-prone), separate component trees (duplicates UI logic).

### Chart Library: Chart.js with ng2-charts
**Decision**: Use Chart.js wrapper for Angular to render pie charts.

**Rationale**: Lightweight, well-maintained, supports required chart types, good theming integration.

**Alternatives Considered**: D3.js (overkill for simple charts), native canvas (reinventing wheel), ECharts (larger bundle).

### Modal Implementation: Angular Material Dialog
**Decision**: Use `MatDialog` for transaction creation/edit modals.

**Rationale**: Consistent with Material Design if used elsewhere, accessible, handles focus management and keyboard navigation.

**Alternatives Considered**: Custom modal (more work, accessibility concerns), ngx-bootstrap modal (additional dependency if Material already present).

### Time Range Filtering: Filter Service with Computed Ranges
**Decision**: Create a `DateRangeService` that computes start/end dates based on selected range type and date. Components subscribe to range changes and re-fetch data.

**Rationale**: Centralized date logic, reusable across cards, supports calendar integration.

## Risks / Trade-offs

**[Risk]** Demo mode data persistence across sessions could confuse users → **Mitigation**: Clear indicator of active mode in header, option to clear demo data.

**[Risk]** API host from environment variable not configured → **Mitigation**: Provide default fallback in environment file, validation check on app initialization.

**[Risk]** Chart library bundle size impact → **Mitigation**: Lazy load feature module, tree-shake unused chart types.

**[Trade-off]** Using localStorage for demo mode limits data size (5-10MB) → **Acceptable**: Budget data unlikely to exceed limits for demo purposes.

**[Trade-off]** Two storage implementations increase maintenance → **Acceptable**: Interface abstraction minimizes duplication, clear separation of concerns.

**[Risk]** API response shape mismatches → **Mitigation**: Define TypeScript interfaces matching API contracts, validate responses in services.
