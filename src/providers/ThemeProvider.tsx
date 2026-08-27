import {
  ThemeProvider as MUIThemeProvider, // eslint-disable-line no-restricted-imports
} from "@mui/material/styles"
import React, { useEffect, useMemo, useState } from "react"
import { ThemeContext, ThemeMode, ThemeSettings, ThemeState, isThemeSettings } from "../hooks/useTheme"
import { Helmet } from "react-helmet-async"
import { createAdsEngTheme } from "../theme/theme"
import { getStorageItem, setStorageItem } from "../utils/storage"

const THEME_SETTINGS_STORAGE_KEY = "themeSettings"

function getPrefersColorSchemeDarkMediaQuery(): MediaQueryList | null {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null
}

export type ThemeProviderProps = React.PropsWithChildren

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const persistedThemeSettings = getStorageItem(THEME_SETTINGS_STORAGE_KEY, isThemeSettings) ?? { mode: "system" }

  const [settings, setSettings] = useState<ThemeSettings>({
    mode: persistedThemeSettings.mode ?? "system",
  })

  const prefersColorSchemeDarkMediaQuery = useMemo(getPrefersColorSchemeDarkMediaQuery, [])

  const [systemMode, setSystemMode] = useState<ThemeMode>(
    prefersColorSchemeDarkMediaQuery?.matches ? "dark" : "light",
  )

  if (settings.mode !== persistedThemeSettings.mode) {
    setStorageItem(THEME_SETTINGS_STORAGE_KEY, settings)
  }

  useEffect(() => {
    if (!prefersColorSchemeDarkMediaQuery) {
      return
    }

    const onChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? "dark" : "light")
    }

    prefersColorSchemeDarkMediaQuery.addEventListener("change", onChange)
    return () => prefersColorSchemeDarkMediaQuery.removeEventListener("change", onChange)
  }, [prefersColorSchemeDarkMediaQuery])

  const mode = settings.mode === "system" ? systemMode : settings.mode

  // The palette literal that used to be inlined here now lives in `src/theme/theme.ts`, so
  // Storybook and the Jest render wrapper build the exact same theme this provider does.
  const theme = createAdsEngTheme(mode)

  const themeState: ThemeState = {
    mode,
    settings,
    theme,
  }

  return (
    <ThemeContext.Provider value={[themeState, setSettings]}>
      <Helmet bodyAttributes={{ "class": "ag-theme-mode", "data-ag-theme-mode": mode }} />
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

ThemeProvider.displayName = "ThemeProvider"
