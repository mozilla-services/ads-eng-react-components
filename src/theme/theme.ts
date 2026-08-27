import {
  PaletteOptions as MUIPaletteOptions, // eslint-disable-line no-restricted-imports
  Theme as MUITheme, // eslint-disable-line no-restricted-imports
  createTheme,
} from "@mui/material/styles"

export type ThemeMode = "light" | "dark"

/**
 * Palette extensions shared by every ads-eng product. Declared in `src/mui.d.ts` so
 * `theme.palette.env` / `theme.palette.flags` are typed for consumers of this package.
 */
export const defaultPaletteOptions: MUIPaletteOptions = {
  env: {
    dev: "#c62828",
    stage: "#ef6c00",
    prod: "#1976d2",
  },
  flags: {
    red: "#ef4444",
    orange: "#f97316",
    yellow: "#eab308",
    green: "#22c55e",
    blue: "#3b82f6",
  },
}

/**
 * Build the shared theme for a given color-scheme mode.
 *
 * Consuming apps own theme *state* (persistence, `prefers-color-scheme` listeners); this
 * package only owns the theme *definition* so components look identical everywhere.
 */
export function createAdsEngTheme(mode: ThemeMode = "light"): MUITheme {
  return createTheme({
    cssVariables: true,
    palette: {
      ...defaultPaletteOptions,
      mode,
    },
  })
}
