import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Polyfill window.scrollTo if not available in jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
}
