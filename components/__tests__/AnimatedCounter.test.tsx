import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import AnimatedCounter from "@/components/AnimatedCounter";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  static instances: MockIntersectionObserver[] = [];
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
    MockIntersectionObserver.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  trigger(intersecting: boolean) {
    this.callback(
      [{ isIntersecting: intersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

let rafCallbacks: FrameRequestCallback[] = [];
let rafId = 0;
let clock = 0;

function useQueuedRaf() {
  rafCallbacks = [];
  clock = 0;
  jest.spyOn(performance, "now").mockImplementation(() => clock);
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    rafCallbacks.push(cb);
    return ++rafId;
  };
  (global as any).cancelAnimationFrame = jest.fn();
}

function flushFrame(now: number) {
  clock = now;
  const pending = rafCallbacks;
  rafCallbacks = [];
  act(() => {
    for (const cb of pending) cb.call(null, now);
  });
}

afterEach(() => {
  rafCallbacks = [];
  MockIntersectionObserver.instances = [];
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("AnimatedCounter", () => {
  it("shows the final value immediately when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(<AnimatedCounter target={5000} suffix="+" />);
    expect(screen.getByText("5,000+")).toBeInTheDocument();
  });

  it("shows the final value immediately when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", { value: undefined, writable: true });
    render(<AnimatedCounter target={7500} prefix="$" suffix="+" />);
    expect(screen.getByText("$7,500+")).toBeInTheDocument();
  });

  it("renders zero and does not animate until the element enters the viewport", () => {
    mockMatchMedia(false);
    useQueuedRaf();
    window.IntersectionObserver = MockIntersectionObserver as any;

    render(<AnimatedCounter target={1000} suffix="+" />);
    expect(screen.getByText("0+")).toBeInTheDocument();
    expect(rafCallbacks.length).toBe(0);
  });

  it("counts up to the target and reaches the final value on viewport entry", () => {
    mockMatchMedia(false);
    useQueuedRaf();
    window.IntersectionObserver = MockIntersectionObserver as any;

    render(<AnimatedCounter target={1000} suffix="+" />);

    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });

    expect(screen.getByText("0+")).toBeInTheDocument();

    flushFrame(0);
    flushFrame(500);
    flushFrame(1000);
    flushFrame(1500);
    flushFrame(2000);

    expect(screen.getByText("1,000+")).toBeInTheDocument();
  });

  it("animates only once even if the observer reports repeatedly", () => {
    mockMatchMedia(false);
    useQueuedRaf();
    window.IntersectionObserver = MockIntersectionObserver as any;

    render(<AnimatedCounter target={500} suffix="+" />);

    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });
    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });

    flushFrame(2000);
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(rafCallbacks.length).toBe(0);
  });

  it("keeps the prefix and suffix in the final formatted output", () => {
    mockMatchMedia(true);
    render(<>
      <AnimatedCounter target={5000} prefix="" suffix="+" />
      <AnimatedCounter target={7500} prefix="$" suffix="+" />
    </>);
    expect(screen.getByText("5,000+")).toBeInTheDocument();
    expect(screen.getByText("$7,500+")).toBeInTheDocument();
  });
});
