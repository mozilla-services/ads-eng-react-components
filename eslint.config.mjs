// @ts-check

import eslint from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import reactPlugin from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"
import storybook from "eslint-plugin-storybook"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    settings: {
      react: {
        version: "18.3",
      },
    },
  },
  {
    ignores: [
      ".swc/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "storybook-static/**",
    ],
  },
  eslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs["recommended-latest"],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactRefresh.configs.vite,
  tseslint.configs.recommended,
  stylistic.configs["recommended"],
  stylistic.configs.customize({
    quotes: "double",
  }),
  storybook.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // Favor named imports for MUI icons.
            // GOOD: `import { Search } from "@mui/icons-material"`
            // BAD: `import SearchIcon from "@mui/icons-material/Search"`
            {
              group: ["@mui/icons-material/*"],
              message: "Use a named import instead, e.g. `import { Search } from \"@mui/icons-material\"` rather than `import SearchIcon from \"@mui/icons-material/Flip\"`.",
            },
            // Restrict importing components directly from `@mui/lab` to favor importing from our
            // own component library. When importing from MUI is necessary to support the creation
            // of our own opinionated wrapper components, explicitly use `// eslint-disable-line`
            // in the `import` statements in the components.
            {
              group: ["@mui/lab"],
              importNamePattern: "^[A-Z]",
            },
            // Also restrict importing components from `@mui/lab` as unnamed default imports. This
            // rule should never be explicitly allowed. If a component must be imported from here,
            // `MUI`-prefixed named import is required.
            {
              group: ["@mui/lab/*"],
              importNamePattern: "^[A-Z]",
            },
            // Restrict importing components directly from `@mui/material` to favor importing from
            // our own component library. When importing from MUI is necessary to support the creation
            // of our own opinionated wrapper components, explicitly use `// eslint-disable-line`
            // in the `import` statements in the components.
            {
              group: ["@mui/material"],
              importNamePattern: "^[A-Z]",
            },
            // Also restrict importing components from `@mui/material` as unnamed default imports.
            // This rule should never be explicitly allowed. If a component must be imported from
            // here, `MUI`-prefixed named import is required.
            {
              group: ["@mui/material/*"],
              importNamePattern: "^[A-Z]",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        // In addition to general restrictions on importing directly from `@mui/lab`,
        // intentional imports to support the creation of our own wrapper components
        // must use named imports that locally map the components to a `MUI`-prefixed
        // name (e.g.: `import { TabPanel as MUITabPanel } from "@mui/lab"`). This
        // increases visibility of direct usages of unwrapped MUI components while
        // preventing naming collisions.
        {
          selector:
            "ImportDeclaration[source.value='@mui/lab'] > ImportSpecifier[imported.name=/^[A-Z]/]:not([local.name=/^MUI/])",
          message: "Alias @mui/lab component imports with a `MUI` prefix, e.g. `import { TabContext as MUITabContext } from \"@mui/lab\"`.",
        },
        // In addition to general restrictions on importing directly from `@mui/material`,
        // intentional imports to support the creation of our own wrapper components
        // must use named imports that locally map the components to a `MUI`-prefixed
        // name (e.g.: `import { TabPanel as MUITabPanel } from "@mui/lab"`). This
        // increases visibility of direct usages of unwrapped MUI components while
        // preventing naming collisions.
        {
          selector:
            "ImportDeclaration[source.value='@mui/material'] > ImportSpecifier[imported.name=/^[A-Z]/]:not([local.name=/^MUI/])",
          message: "Alias @mui/material component imports with a `MUI` prefix, e.g. `import { Button as MUIButton } from \"@mui/material\"`.",
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "addEventListener" },
        { name: "alert" },
        { name: "blur" },
        { name: "btoa" },
        { name: "close" },
        { name: "confirm" },
        { name: "fetch" },
        { name: "focus" },
        { name: "getComputedStyle" },
        { name: "innerHeight" },
        { name: "innerWidth" },
        { name: "location" },
        { name: "open" },
        { name: "prompt" },
        { name: "requestAnimationFrame" },
        { name: "resizeBy" },
        { name: "resizeTo" },
        { name: "screen" },
        { name: "scroll" },
        { name: "scrollTo" },
        { name: "stop" },
      ],
    },
  },
  {
    files: ["src/**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            // Prevent direct usage of `render` from `@testing-library/react` in our
            // tests in favor of `render` from `src/test/utils` which automatically
            // wraps the components being tested in the necessary providers such as
            // `<HelmetProvider />` and `<MemoryRouter />`.
            {
              name: "@testing-library/react",
              importNames: ["render"],
              message: "Import `render` from \"src/test/utils\" so tests share the standard providers.",
            },
          ],
        },
      ],
    },
  },
  {
    // Stories intentionally export non-component values (meta objects, story objects)
    // and reach for MUI directly when documenting composition.
    files: [".storybook/**/*.{ts,tsx}", "src/**/*.stories.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-syntax": "off",
      "react-refresh/only-export-components": "off",
    },
  },
)
