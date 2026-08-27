// Augments MUI's theme with the palettes created in `src/theme/theme.ts`, so
// `theme.palette.env` and `theme.palette.flags` are typed for consumers of this package.
//
// `EnvPalette` / `FlagsPalette` are exported and re-exported from `src/index.ts` on purpose:
// TypeScript elides side-effect-only imports from declaration output, so a named export is
// what keeps this module — and the augmentation below — reachable from `dist/index.d.ts`.
import "@mui/material/styles"

/** Accent colors identifying which deployment environment a UI is pointed at. */
export interface EnvPalette {
  dev: string
  stage: string
  prod: string
}

/** Colors available to user-assignable row/record flags. */
export interface FlagsPalette {
  red: string
  orange: string
  yellow: string
  green: string
  blue: string
}

declare module "@mui/material/styles" {
  interface PaletteOptions {
    env?: Partial<EnvPalette>
    flags?: Partial<FlagsPalette>
  }
  interface Palette {
    env: EnvPalette
    flags: FlagsPalette
  }
}
