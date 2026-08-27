import { readdirSync } from "node:fs"
import { join, relative } from "node:path"

import { composeStories, setProjectAnnotations } from "@storybook/react"
// Deliberately the unwrapped `render`: `setProjectAnnotations` below already applies the
// Storybook preview's provider stack, so `test/utils`'s wrapper would nest a second copy of
// HelmetProvider/ThemeProvider/MemoryRouter around every story.
// eslint-disable-next-line no-restricted-imports
import { render } from "@testing-library/react"

import preview from "../../.storybook/preview"

// `build-storybook` bundles stories but never renders them, so a story that throws would
// otherwise only be caught by a human opening Storybook. This renders every story once.
//
// Story files are discovered from disk rather than listed, so a new component's stories are
// covered the moment the file exists.

// Applies the preview-level decorators (HelmetProvider, MUI ThemeProvider, MemoryRouter) that
// Storybook wraps every story in. Without this, portable stories render bare and anything
// needing a provider fails for the wrong reason.
setProjectAnnotations([preview])

const COMPONENTS_DIR = join(__dirname, "..", "components")

function findStoryFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return findStoryFiles(path)
    }
    return entry.name.endsWith(".stories.tsx") ? [path] : []
  })
}

const storyFiles = findStoryFiles(COMPONENTS_DIR).sort()

describe("component stories", () => {
  test("story files were discovered", () => {
    expect(storyFiles.length).toBeGreaterThan(0)
  })

  test("every component module has a story file", () => {
    const componentModules = findComponentModules(COMPONENTS_DIR)
    const withoutStories = componentModules.filter(path => !storyFiles.includes(path.replace(/\.tsx$/, ".stories.tsx")))

    expect(withoutStories.map(path => relative(COMPONENTS_DIR, path))).toEqual([])
  })

  for (const file of storyFiles) {
    const name = relative(COMPONENTS_DIR, file).replace(/\.stories\.tsx$/, "")

    describe(name, () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const composed = composeStories(require(file))

      for (const [storyName, Story] of Object.entries(composed)) {
        const Composed = Story as React.ComponentType

        test(`${storyName} renders`, () => {
          expect(() => render(<Composed />)).not.toThrow()
        })
      }
    })
  }
})

function findComponentModules(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return findComponentModules(path)
    }
    if (!entry.name.endsWith(".tsx") || entry.name.endsWith(".test.tsx") || entry.name.endsWith(".stories.tsx")) {
      return []
    }
    return [path]
  })
}
