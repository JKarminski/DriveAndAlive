/**
 * Global test setup for Vitest + React Testing Library.
 */
import "@testing-library/jest-dom";

// Silence CSS modules warnings in tests
Object.defineProperty(window, "CSS", { value: null });

// Suppress console.error for known React warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning:") || args[0].includes("ReactDOM.render"))
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
