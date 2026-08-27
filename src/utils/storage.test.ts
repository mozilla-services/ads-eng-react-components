import {
  getStorageItem,
  isStorageObject,
  parseStorageValue,
  removeStorageItem,
  setStorageItem,
} from "./storage"

interface Settings {
  mode: string
}

const isSettings = (value: unknown): value is Settings => isStorageObject(value)

describe("storage.ts", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe("getStorageItem() / setStorageItem()", () => {
    test("round-trips a value through JSON serialization", () => {
      setStorageItem("themeSettings", { mode: "dark" })
      expect(getStorageItem<Settings>("themeSettings")).toEqual({ mode: "dark" })
    })

    test("round-trips non-object values", () => {
      setStorageItem("fetchState", "idle")
      expect(getStorageItem<string>("fetchState")).toBe("idle")
    })

    test("returns null for a key that was never set", () => {
      expect(getStorageItem("missing")).toBeNull()
    })

    test("returns null when the stored JSON is malformed", () => {
      window.localStorage.setItem("themeSettings", "{not json")
      expect(getStorageItem("themeSettings")).toBeNull()
    })

    test("returns null for an explicitly stored null", () => {
      setStorageItem("themeSettings", null)
      expect(getStorageItem("themeSettings")).toBeNull()
    })
  })

  describe("validation", () => {
    test("returns the value when the validator passes", () => {
      setStorageItem("themeSettings", { mode: "light" })
      expect(getStorageItem("themeSettings", isSettings)).toEqual({ mode: "light" })
    })

    test("returns null when the validator rejects the value", () => {
      setStorageItem("themeSettings", ["light"])
      expect(getStorageItem("themeSettings", isSettings)).toBeNull()
    })

    test("skips validation when no validator is supplied", () => {
      setStorageItem("themeSettings", ["light"])
      expect(getStorageItem("themeSettings")).toEqual(["light"])
    })
  })

  describe("isStorageObject()", () => {
    test.each([
      ["a record", { a: 1 }, true],
      ["an array", [1, 2], false],
      ["null", null, false],
      ["a string", "foo", false],
      ["a number", 1, false],
    ])("returns %s -> %s", (_label, value, expected) => {
      expect(isStorageObject(value)).toBe(expected)
    })
  })

  describe("parseStorageValue()", () => {
    test("parses a raw JSON string", () => {
      expect(parseStorageValue<Settings>("{\"mode\":\"dark\"}")).toEqual({ mode: "dark" })
    })

    test("returns null for a null raw value", () => {
      expect(parseStorageValue(null)).toBeNull()
    })
  })

  describe("removeStorageItem()", () => {
    test("removes a stored item", () => {
      setStorageItem("themeSettings", { mode: "dark" })
      removeStorageItem("themeSettings")
      expect(getStorageItem("themeSettings")).toBeNull()
    })
  })
})
