import { act } from "@testing-library/react"
import { render } from "../test/utils"
import { useTheme } from "../hooks/useTheme"
import { ThemeProvider } from "./ThemeProvider"

const THEME_SETTINGS_STORAGE_KEY = "themeSettings"

const ThemeProbe = () => {
  const [themeState, setSettings] = useTheme()

  return (
    <button
      type="button"
      data-mode={themeState.mode}
      data-settings-mode={themeState.settings.mode}
      data-primary={themeState.theme?.palette.primary.main}
      data-flag-red={themeState.theme?.palette.flags.red}
      onClick={() => setSettings({ mode: "dark" })}
    >
      probe
    </button>
  )
}

function renderProvider() {
  const result = render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  )
  return { result, probe: result.getByRole("button") }
}

describe("ThemeProvider.tsx", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test("defaults to the 'system' setting and resolves to light when the OS is not dark", () => {
    const { probe } = renderProvider()

    expect(probe.dataset.settingsMode).toBe("system")
    // The `matchMedia` mock in jest.setup.ts always reports `matches: false`.
    expect(probe.dataset.mode).toBe("light")
  })

  test("exposes the shared `flags` palette through the context theme", () => {
    const { probe } = renderProvider()
    expect(probe.dataset.flagRed).toBe("#ef4444")
  })

  test("hydrates the mode from a persisted preference", () => {
    window.localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, JSON.stringify({ mode: "dark" }))

    const { probe } = renderProvider()

    expect(probe.dataset.settingsMode).toBe("dark")
    expect(probe.dataset.mode).toBe("dark")
  })

  test("falls back to 'system' when the persisted preference is malformed", () => {
    window.localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, "{not json")

    const { probe } = renderProvider()

    expect(probe.dataset.settingsMode).toBe("system")
  })

  test("persists a mode change back to localStorage", () => {
    const { probe } = renderProvider()

    act(() => {
      probe.click()
    })

    expect(probe.dataset.mode).toBe("dark")
    expect(JSON.parse(window.localStorage.getItem(THEME_SETTINGS_STORAGE_KEY) ?? "null")).toEqual({ mode: "dark" })
  })
})

describe("ThemeProvider.tsx without matchMedia", () => {
  // Guards the regression that turning this app module into a package entrypoint export
  // introduced: a module-scope `window.matchMedia()` call crashed on import anywhere
  // `window` is absent. The provider must now tolerate a missing `matchMedia`.
  const nativeMatchMedia = globalThis.matchMedia

  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(globalThis, "matchMedia", { value: undefined, writable: true, configurable: true })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, "matchMedia", { value: nativeMatchMedia, writable: true, configurable: true })
  })

  test("falls back to light mode when matchMedia is unavailable", () => {
    const result = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(result.getByRole("button").dataset.mode).toBe("light")
  })

  test("still honors an explicit persisted mode", () => {
    window.localStorage.setItem(THEME_SETTINGS_STORAGE_KEY, JSON.stringify({ mode: "dark" }))

    const result = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(result.getByRole("button").dataset.mode).toBe("dark")
  })
})
