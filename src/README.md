# Project Structure

This project follows a feature-first organization pattern with shared components. Here's an overview of the main directories and their purposes:

## Directory Structure

```
src/
├── features/           # Feature-specific code
│   └── dashboard/
│       ├── components/   # Components specific to the dashboard
│       ├── hooks/        # Custom hooks for dashboard functionality
│       ├── services/     # API and data services
│       ├── constants/    # Feature-specific constants
│       ├── types/        # Type definitions for the feature
│       └── utils/        # Utility functions specific to dashboard
│
├── shared/            # Shared/common code
│   └── components/
│       ├── atoms/       # Basic UI components (Button, Input, etc.)
│       ├── molecules/   # Composite components
│       └── organisms/   # Complex components
│
├── utils/             # Global utility functions
│   ├── formatting/      # Formatting utilities
│   ├── validation/     # Validation helpers
│   └── helpers/        # General helper functions
│
├── types/             # Global type definitions
└── config/            # Application configuration
```

## Organization Principles

1. **Feature-First Organization**
   - Each feature has its own directory with all related code
   - Features are self-contained and independent
   - Shared code is extracted to appropriate shared directories

2. **Component Hierarchy**
   - Atoms: Basic building blocks (buttons, inputs)
   - Molecules: Combinations of atoms (form fields, search bars)
   - Organisms: Complex UI components (navigation, sidebars)

3. **Code Organization**
   - Clear separation of concerns
   - Related code stays together
   - Shared code is properly abstracted

## Best Practices

1. **Imports**
   - Use absolute imports with `@/` prefix
   - Group imports by type (React, components, utilities)

2. **Components**
   - One component per file
   - Use index files for clean exports
   - Keep components focused and single-responsibility

3. **Types**
   - Define types close to where they're used
   - Share common types in `types/` directory
   - Use TypeScript features effectively

4. **State Management**
   - Use hooks for component-level state
   - Implement services for data fetching
   - Keep business logic separate from UI

## Adding New Features

When adding a new feature:

1. Create a new directory under `features/`
2. Follow the established structure (components, hooks, etc.)
3. Keep feature-specific code within the feature directory
4. Extract shared code when appropriate

## Shared Components

When creating shared components:

1. Place in appropriate atomic design level (atoms/molecules/organisms)
2. Create component directory with component file and index
3. Include types and tests if applicable
4. Document component usage and props
