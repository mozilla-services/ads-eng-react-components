import { createAdsEngTheme } from "./theme"

describe("theme.ts", () => {
  test("createAdsEngTheme() defaults to light mode", () => {
    expect(createAdsEngTheme().palette.mode).toBe("light")
  })

  test("createAdsEngTheme() honors the requested mode", () => {
    expect(createAdsEngTheme("dark").palette.mode).toBe("dark")
  })

  test("createAdsEngTheme() exposes the shared `env` and `flags` palettes", () => {
    const { palette } = createAdsEngTheme()

    expect(palette.env.prod).toBe("#1976d2")
    expect(palette.flags.red).toBe("#ef4444")
  })
})
