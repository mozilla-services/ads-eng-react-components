import {
  Theme as MUITheme, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import React from "react"
import { ThemeMode } from "../theme/theme"

// `ThemeMode` is defined in `src/theme/theme.ts` (the theme definition) and re-exported here
// so existing `import { ThemeMode } from ".../useTheme"` call sites keep working.
export type { ThemeMode }

export type ThemeSettingsMode = ThemeMode | "system"

export interface ThemeSettings {
  mode: ThemeSettingsMode
}

export interface ThemeState {
  mode: ThemeMode
  settings: ThemeSettings
  theme?: MUITheme
}

export function isThemeSettings(value: unknown): value is ThemeSettings {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export const ThemeContext = React.createContext<[ThemeState, React.Dispatch<React.SetStateAction<ThemeSettings>>]>([
  {
    mode: "light",
    settings: {
      mode: "system",
    },
  },

  () => {},
])

export const useTheme = () => React.useContext(ThemeContext)
