import "@testing-library/jest-dom"
import { TextDecoder, TextEncoder } from "node:util"

import { mockLocalStorage } from "./src/test/mocks/mockStorage"

Object.assign(globalThis, { TextDecoder, TextEncoder })

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
})

// Mock BroadcastChannel for tests
export class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = []
  name: string
  onmessage: ((event: MessageEvent) => void) | null = null

  constructor(name: string) {
    this.name = name
    MockBroadcastChannel.instances.push(this)
  }

  postMessage(): void {
    // No-op in tests - cross-tab communication not needed
  }

  close(): void {
    // No-op in tests
  }

  static clearInstances(): void {
    MockBroadcastChannel.instances = []
  }
}

Object.defineProperty(globalThis, "BroadcastChannel", {
  value: MockBroadcastChannel,
  writable: true,
  configurable: true,
})

// jsdom implements neither ResizeObserver nor IntersectionObserver. `react-resizable-panels`
// (<SplitLayout />) constructs a ResizeObserver during its layout effect and throws without
// one, so both get inert stubs here rather than in each test.
export class MockObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] {
    return []
  }
}

for (const name of ["ResizeObserver", "IntersectionObserver"]) {
  Object.defineProperty(globalThis, name, {
    value: MockObserver,
    writable: true,
    configurable: true,
  })
}

export function mockMatchMedia(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }
}

// `configurable` so individual tests can swap or remove it (e.g. asserting a component
// tolerates a host with no `matchMedia`).
Object.defineProperty(globalThis, "matchMedia", {
  value: mockMatchMedia,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis.URL, "createObjectURL", {
  value: jest.fn(() => "blob:mock-url"),
  writable: true,
})

// Suppress console error messages originating from "node_modules"
const nativeConsole = globalThis.console
Object.defineProperty(globalThis, "console", {
  value: {
    ...nativeConsole,
    error: (...data: unknown[]) => {
      if (!(new Error()).stack?.includes("node_modules")) {
        nativeConsole.error(...data)
      }
    },
  },
})

// Global mock for react-router-dom's useLocation
// This prevents components using useLocation from requiring Router context in tests
// Tests can override this by calling jest.mock("react-router-dom", ...) themselves
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({ pathname: "/test-path" }),
  // Provide router hooks without requiring a <Router> in every test (mirrors useLocation above).
  // Tests can override these by calling jest.mock("react-router-dom", ...) themselves.
  useNavigate: () => jest.fn(),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}))

// When the ag-grid-backed components (DataGrid, DataViz) are relocated here, register
// their modules and license alongside the mocks above, e.g.:
//
//   import { AllEnterpriseModule, ClientSideRowModelModule, LicenseManager, ModuleRegistry } from "ag-grid-enterprise"
//   LicenseManager.setLicenseKey(process.env.AG_GRID_LICENSE_KEY ?? "")
//   ModuleRegistry.registerModules([AllEnterpriseModule, ClientSideRowModelModule])
