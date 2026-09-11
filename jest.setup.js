import React from "react";
import "@testing-library/jest-dom";

jest.mock("next/link", () => {
  const MockLink = ({ href, children, ...props }) =>
    React.createElement("a", { href, ...props }, children);
  MockLink.displayName = "MockLink";
  return MockLink;
});

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = global.IntersectionObserver || MockIntersectionObserver;