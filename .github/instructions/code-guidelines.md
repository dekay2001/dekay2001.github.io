# Code Guidelines

## TypeScript Guidelines

### When Writing TypeScript

- **CRITICAL**: Always edit TypeScript source in `src/` directory, NEVER edit compiled JavaScript in `assets/js/`
- Use ES6+ syntax with TypeScript types
- Place source files in `src/base/` or `src/yoga/` depending on purpose
- Export functions/classes with proper TypeScript types: `export function functionName(param: Type): ReturnType { }`
- Define interfaces for data structures: `interface MyData { prop: string; }`
- Follow existing patterns from `displayables.ts` and `models.ts`
- Compile TypeScript after changes: `npm run build`

**Template:**
```typescript
/**
 * @description Brief description of what this does
 */
export function myFunction(input: string): number {
  return input.length;
}

export interface MyData {
  id: number;
  name: string;
}
```

---

## Testing Standards

### Test Development Approach

- Write tests before or alongside code (TDD/BDD)
- Tests should document expected behavior and serve as living documentation
- Create test files in `test/unit/` mirroring source structure

### Test File Structure

- Test file naming: `*.test.ts` (e.g., `blog-search.test.ts`)
- Use `@jest-environment jsdom` comment when DOM is required
- Import from **TypeScript source**: `import { Thing } from '../../../../../src/base/models';`
- Group related tests with `describe()` blocks

**Template:**
```typescript
import { myFunction } from '../../../../../src/base/example';

describe('myFunction', () => {
  test('should perform expected behavior', () => {
    expect(myFunction('test')).toBe(4);
  });
});
```

### Test Naming and Organization

- Use descriptive test names: `test('should calculate total with discount applied')`
- Alternative pattern: "should [expected behavior] when [condition]"
- Follow **Arrange-Act-Assert** pattern:
  ```typescript
  test('should return discounted price', () => {
    // Arrange: Set up test data
    const item = { price: 100, discount: 0.2 };
    
    // Act: Execute the function
    const result = calculatePrice(item);
    
    // Assert: Verify the result
    expect(result).toBe(80);
  });
  ```

### Mocking and Dependencies

- Mock external dependencies (fetch, DOM elements, file system)
- Use Jest mocking: `jest.fn()`, `jest.mock()`
- Mock `global.fetch` for API calls in jsdom environment
- Keep mocks simple and focused on the test's purpose

### Coverage and Quality

- Aim for >80% code coverage for critical paths
- Test both happy paths and edge cases
- Test error handling and validation
- Run tests before committing: `npm test -- --watchAll=false`
- Verify all tests pass before pushing changes

---

## Clean Code Standards

### Public Interface First (Critical)

**Always declare public interfaces at the top of modules and classes** to enable top-down reading without jumping around in code.

- **Modules**: Export statements and public functions/constants should be declared first
- **Classes**: Public methods and properties should be declared before private ones
- **Rationale**: Readers should understand the public API without scrolling through implementation details

**Example - Module Structure:**
```typescript
// ✅ CORRECT: Public interface first
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + _applyDiscount(item), 0);
}

export function formatPrice(amount: number): string {
  return _currencyFormatter.format(amount);
}

// Private implementation details below
function _applyDiscount(item: Item): number {
  return item.price * (1 - item.discount);
}

const _currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
```

### JavaScript/TypeScript Best Practices

**Modern JavaScript (ES6+)**:
- Use `const` by default, `let` only when reassignment needed, never `var`
- Prefer arrow functions for callbacks and non-method functions
- Use template literals for string interpolation
- Destructuring for object/array extraction
- Spread operator for object/array copying
- Default parameters instead of `||` fallbacks

**Naming Conventions**:
- `camelCase` for variables, functions, and methods
- `PascalCase` for classes and constructors
- `UPPER_SNAKE_CASE` for constants
- Prefix private methods/properties with underscore: `_privateMethod`
- Use descriptive names that reveal intent

**Function Design**:
- Keep functions small and focused (single responsibility)
- Limit parameters (3 or fewer; use object for more)
- Avoid side effects in pure functions
- Return early to reduce nesting
- Use async/await instead of promise chains

**Error Handling**:
- Always handle promise rejections
- Use try/catch with async/await
- Throw meaningful error messages
- Validate inputs early
- Don't catch errors you can't handle

**Code Organization**:
- One class per file (with same name as file)
- Group related functions in modules
- Import statements at top, grouped by type (external, internal, local)
- Maximum file length: ~300 lines (split if larger)

**Comments and Documentation**:
- Use JSDoc for public APIs
- Comment "why", not "what"
- Keep comments up-to-date with code
- Document non-obvious behavior or edge cases

---

## Code Review Checklist

During code reviews, **always verify**:

1. ✅ **Public interfaces declared first** in all modules and classes
2. ✅ Modern JavaScript patterns used (const/let, arrow functions, destructuring)
3. ✅ Functions are small, focused, and well-named
4. ✅ Consistent naming conventions throughout
5. ✅ Error handling present for async operations
6. ✅ No commented-out code or console.log statements
7. ✅ JSDoc comments for public APIs
8. ✅ Imports organized and grouped logically
9. ✅ No magic numbers or strings (use named constants)
10. ✅ Code is DRY (Don't Repeat Yourself)

---

## Anti-Patterns to Avoid

**Avoid**:
- ❌ Nested callbacks (callback hell) - use async/await
- ❌ Modifying function parameters
- ❌ Implicit type coercion (`==` instead of `===`)
- ❌ Global variables
- ❌ Large functions (>30 lines typically needs splitting)
- ❌ Deep nesting (>3 levels indicates refactoring needed)
- ❌ Mixed public/private declarations in classes
- ❌ Mixing concerns in a single function/module

---

## Code Style Preferences

### TypeScript
- Use ES6+ features with TypeScript types
- Prefer functional programming patterns
- Export reusable functions and classes
- Document complex logic with comments

### Markdown
- Use ATX-style headers (`#`, `##`, etc.)
- Code blocks with language specification
- Follow existing blog post tone and structure

### HTML/Liquid
- Semantic HTML5 elements
- Liquid tags for dynamic content
- Maintain accessibility (alt text, ARIA labels where needed)

### CSS
- BEM-like naming or existing convention
- Mobile-first responsive design
- Organize by component/section
