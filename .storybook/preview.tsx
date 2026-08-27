import { CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material"
import type { Decorator, Preview } from "@storybook/react-vite"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"

import { createAdsEngTheme, type ThemeMode } from "../src/theme/theme"

// Mirrors `src/test/utils.tsx` so a component looks the same in Storybook as it does
// under test. Keep the two stacks in sync when you add a provider.
const withProviders: Decorator = (Story, context) => {
  const mode = (context.globals.theme as ThemeMode | undefined) ?? "light"

  return (
    <HelmetProvider>
      <MUIThemeProvider theme={createAdsEngTheme(mode)}>
        <CssBaseline />
        <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Story />
        </MemoryRouter>
      </MUIThemeProvider>
    </HelmetProvider>
  )
}

const preview: Preview = {
  decorators: [withProviders],
  initialGlobals: {
    theme: "light",
  },
  globalTypes: {
    theme: {
      description: "MUI color scheme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
}

export default preview
