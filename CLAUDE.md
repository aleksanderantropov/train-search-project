# Claude Code Guidelines

## Project Architecture

### Framework & Dependencies
- **Next.js 14.2.5** - React framework with App Router
- **TypeScript 5.5.3** - Strict mode enabled
- **React 18.3.1** - UI library
- **Redux Toolkit 2.2.1** - State management
- **React Redux 9.1.0** - React bindings for Redux

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── *.module.css      # Page-specific CSS modules
├── components/            # Reusable UI components
│   └── *.module.css      # Component-specific CSS modules
├── lib/                  # Application logic
│   ├── hooks.ts          # Typed Redux hooks
│   ├── store.ts          # Redux store configuration
│   └── slices/           # Redux slices
├── utils/                # Utility functions (domain-organized)
└── CLAUDE.md             # This file
```

## Code Style & Standards

### TypeScript Configuration
- **Strict mode enabled** - All strict checking enabled
- **Path mapping** - Use `@/` for absolute imports from project root
- **Module resolution** - Bundler mode for Next.js compatibility

### Import Conventions
- **Absolute imports preferred** - Use `@/` prefix for all internal imports
- **Group imports** - React/external libraries first, then internal imports
- **Order**: Framework → External libraries → Internal modules → Relative imports

Example:
```typescript
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { formatDateTime } from '@/utils/dateUtils';
import styles from './Component.module.css';
```

### Component Architecture

#### Client vs Server Components
- Use `'use client';` directive for components with:
  - State management (useState, useReducer)
  - Event handlers
  - Browser APIs
  - Redux hooks

#### Component Structure
```typescript
'use client';

import { /* imports */ } from '...';
import styles from './Component.module.css';

interface ComponentProps {
  // Props interface
}

export default function Component({ prop }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### Styling

#### CSS Module Architecture
- **Component-specific CSS modules** - Each component has its own `.module.css` file
- **Co-location** - CSS modules live alongside their components
- **No cross-component imports** - Components only import their own CSS modules
- **External control** - Components accept `className` prop for positioning/layout from parent

#### CSS Module Structure
```
components/
├── Component.tsx
├── Component.module.css    # Component's own styles
└── ...
```

#### CSS Module Rules
1. **Self-contained styling** - Each component handles its own visual appearance
2. **No positioning styles** - Components don't control their own positioning (margin, position, etc.)
3. **Accept className prop** - Allow parent components to control positioning
4. **Use semantic class names** - `.container`, `.title`, `.button` not `.redText`, `.bigBox`

Example component with CSS module:
```typescript
import styles from './Component.module.css';

interface ComponentProps {
  className?: string;
}

export default function Component({ className }: ComponentProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className={styles.title}>Title</h2>
      <button className={styles.button}>Click me</button>
    </div>
  );
}
```

#### Global Styles
- **Limited scope** - Only in `app/globals.css` for:
  - CSS resets
  - Typography foundations
  - Global layout utilities
- **No component-specific styles** - Keep global styles truly global

### State Management

#### Redux Setup
- **Redux Toolkit** - Use `createSlice` and `createAsyncThunk`
- **Typed hooks** - Always use `useAppSelector`, `useAppDispatch`, `useAppStore`
- **Store structure** - Organize slices by domain/feature

#### Redux Patterns
```typescript
// Always use typed hooks
const dispatch = useAppDispatch();
const state = useAppSelector((state) => state.feature);

// Async thunks for API calls
export const fetchData = createAsyncThunk(
  'slice/fetchData',
  async () => {
    // API call logic
  }
);
```

#### State Shape
- **Normalized data** - Keep flat structures when possible
- **Loading states** - Include `loading`, `error`, `data` pattern
- **Computed values** - Calculate derived state in reducers

### API Routes
- **File-based routing** - Use `app/api/` directory structure
- **Route handlers** - Export named functions (GET, POST, etc.)
- **Mock data** - Store in `mock.json` files alongside routes

## Utility Functions Organization

### Location
- All utility functions should be placed in the root-level `/utils/` directory
- Do not create component-level or page-level utils folders

### File Structure
Organize utility functions by domain/purpose:

- **`dateUtils.ts`** - Date and time related functions
  - Date formatting
  - Time formatting
  - Duration calculations
  - Date comparisons

- **`trainUtils.ts`** - Train, pricing, and facility related functions
  - Price calculations
  - Facility mappings
  - Train-specific utilities

- **`segmentUtils.ts`** - Segment processing and analysis utilities
  - Segment collection and filtering
  - Date-based segment analysis
  - Segment processing optimizations

### Import Convention
- Always use absolute imports with the `@/utils/` prefix
- Group related functions together in single imports when possible

Example:
```typescript
import { formatDateTime, formatDuration } from '@/utils/dateUtils';
import { findMinPrice, getFacilityIcon } from '@/utils/trainUtils';
```

### Function Organization Rules
1. **Extract helper functions** from TSX files when they:
   - Perform pure calculations
   - Format data
   - Contain business logic
   - Can be reused across components

2. **Group functions logically** by their domain rather than by component usage

3. **Maintain clear separation** between:
   - Date/time operations
   - Business logic operations
   - Formatting functions
   - Utility calculations

### Code Quality
- All utility functions should be pure functions when possible
- Include proper TypeScript types
- Add descriptive comments for complex logic
- Keep functions focused on a single responsibility

## Development Commands
- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run lint`** - Run ESLint
- **`npm start`** - Start production server