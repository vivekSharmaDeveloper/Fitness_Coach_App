# Testing Guide for Fitness Coach App

This document outlines the testing strategy and structure for the Fitness Coach application.

## Test Structure

```
__tests__/
├── components/           # Component unit tests
├── api/                 # API route tests  
├── utils/               # Utility function tests
├── integration/         # Integration tests
├── utils/
│   └── test-utils.tsx   # Testing utilities and helpers
└── README.md           # This file
```

## Test Categories

### 1. Component Tests (`__tests__/components/`)
- **HomePage.test.tsx**: Tests the main landing page component
- **OnboardingForm.test.tsx**: Tests the multi-step onboarding form

These tests verify:
- Component rendering
- User interactions
- State management
- Navigation between steps
- AI recommendation fetching and display

### 2. API Tests (`__tests__/api/`)
- **recommendedGoals.test.ts**: Tests the AI recommendations API endpoint

These tests verify:
- API authentication
- Request/response handling
- Error handling
- Data validation

### 3. Utility Tests (`__tests__/utils/`)
- **vertexai.test.ts**: Tests the Vertex AI integration functions

These tests verify:
- AI recommendation generation
- Fallback mechanisms
- Different user profile scenarios
- Error handling and recovery

### 4. Integration Tests (`__tests__/integration/`)
- **onboarding-to-recommendations.test.tsx**: End-to-end user journey tests

These tests verify:
- Complete user workflows
- Multiple component interactions
- API integration
- Error scenarios

## Running Tests

### Available Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Test Configuration

Tests are configured using:
- **Jest**: Test runner and framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **Supertest**: API endpoint testing

Configuration files:
- `jest.config.js`: Main Jest configuration
- `jest.setup.ts`: Test environment setup and global mocks

## Mock Strategy

### Global Mocks
The following are globally mocked in `jest.setup.ts`:
- `next/navigation` - Router and navigation hooks
- `next-auth/react` - Authentication hooks
- `framer-motion` - Animation library

### Component-Specific Mocks
- **Fetch API**: Mocked in individual tests for API calls
- **Vertex AI Client**: Mocked in utility tests
- **Environment Variables**: Mocked for different test scenarios

## Test Data

Common test data is provided in `__tests__/utils/test-utils.tsx`:
- `mockSession`: Authenticated user session
- `mockOnboardingData`: Complete onboarding form data
- `mockRecommendations`: Sample AI recommendations
- `mockEnvironmentVariables`: Test environment configuration

## Writing New Tests

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '../path/to/component';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interactions', async () => {
    render(<YourComponent />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    // Assert expected behavior
  });
});
```

### API Tests
```typescript
import request from 'supertest';
import app from '../path/to/app';

describe('API Endpoint', () => {
  it('should return expected response', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' })
      .expect(200);
      
    expect(response.body).toEqual(expectedResponse);
  });
});
```

## Test Coverage Goals

The test suite aims for:
- **80%+ line coverage** across the codebase
- **100% coverage** for critical user flows (onboarding, AI recommendations)
- **100% coverage** for API endpoints
- **90%+ coverage** for utility functions

## Continuous Integration

Tests are designed to run in CI environments with:
- No external dependencies (all services mocked)
- Deterministic results
- Fast execution time
- Clear failure reporting

## Debugging Tests

### Common Issues
1. **Component not rendering**: Check if all required props are provided
2. **Async operations failing**: Ensure proper `await` and `waitFor` usage
3. **Mock not working**: Verify mock is set up before component render
4. **API tests failing**: Check request format and expected response structure

### Debug Commands
```bash
# Run specific test file
npm test HomePage.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Run with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --detectOpenHandles --forceExit
```

## Contributing

When adding new features:
1. Write tests before or alongside implementation
2. Ensure new tests follow existing patterns
3. Update test documentation if needed
4. Verify all tests pass before submitting PR
5. Aim for meaningful test names that describe behavior

## Test Philosophy

Our testing approach follows these principles:
- **Test behavior, not implementation details**
- **Write tests from the user's perspective**
- **Prefer integration tests over unit tests when practical**
- **Mock external dependencies, not internal logic**
- **Keep tests simple and readable**
