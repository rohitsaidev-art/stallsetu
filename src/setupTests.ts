import '@testing-library/jest-dom/vitest';

// Polyfill window.scrollTo if not present in jsdom
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

// Polyfill Element.prototype.scrollIntoView
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
