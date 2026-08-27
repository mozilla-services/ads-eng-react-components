/** @type {import('jest').Config} **/
export default {
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/__mocks__/**",
    "!src/index.ts",
    "!src/test/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "text-summary"],
  // Ratcheted just below the current numbers. ad-ops-dashboard's thresholds (79/60/65/80)
  // were an app-wide average; this package's subset runs higher, so raise these rather than
  // inherit slack. Bump them as coverage improves — never lower them.
  //
  // A large share of this comes from `src/test/stories.test.tsx` rendering every story, so
  // deleting stories will drop coverage as well as docs.
  coverageThreshold: {
    global: {
      statements: 92,
      branches: 88,
      functions: 83,
      lines: 93,
    },
  },
  testEnvironment: "jest-environment-jsdom",
  modulePaths: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  // node_modules is not transformed, with one exception: `@storybook/*` ships ESM only and
  // `src/test/stories.test.tsx` imports it to render every story.
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!@storybook[/\\\\]|storybook[/\\\\]).+\\.(js|jsx|mjs|cjs|ts|tsx)$",
  ],
  moduleNameMapper: {
    "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
    "jest-transform-stub",
  },
  moduleFileExtensions: [
    "tsx",
    "ts",
    "web.js",
    "js",
    "web.ts",
    "web.tsx",
    "json",
    "web.jsx",
    "jsx",
    "node",
  ],
  resetMocks: true,
  maxWorkers: "50%",
}
