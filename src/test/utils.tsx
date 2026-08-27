import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles" // eslint-disable-line no-restricted-imports
import { render as unwrappedRender, RenderOptions } from "@testing-library/react"
import React from "react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import { createAdsEngTheme } from "../theme/theme"

/**
 * The provider stack every component test renders inside. This mirrors the wrapper used by
 * `ad-ops-dashboard`'s `src/test/utils` so relocated tests pass without edits — minus the
 * app-owned providers (`GlobalEventTargetProvider`, `PreferencesProvider`, etc.). Add a
 * provider here only once the component that needs it lives in this package.
 */
export function createWrapper() {
  const Wrapper = ({ children }: React.PropsWithChildren) => (
    <HelmetProvider>
      <MUIThemeProvider theme={createAdsEngTheme()}>
        <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          {children}
        </MemoryRouter>
      </MUIThemeProvider>
    </HelmetProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

export function render(ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return unwrappedRender(ui, { wrapper: createWrapper(), ...options })
}

export { sleep } from "../utils/async"

export const TEST_URL = "http://localhost-test"
