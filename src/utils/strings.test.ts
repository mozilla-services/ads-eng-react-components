import { parseMultiValueInputString, splitStringByLastDelimiter } from "./strings"

describe("strings.ts", () => {
  describe("splitStringByLastDelimiter", () => {
    test("Returns ['foobarbaz', undefined] for 'foobarbaz' string with single-character '_' delimiter", () => {
      expect(splitStringByLastDelimiter("foobarbaz", "_")).toEqual(["foobarbaz", undefined])
    })

    test("Returns ['foo_bar', 'baz'] for 'foo_bar_baz' string with single-character '_' delimiter", () => {
      expect(splitStringByLastDelimiter("foo_bar_baz", "_")).toEqual(["foo_bar", "baz"])
    })

    test("Returns ['foo_bar', 'baz'] for 'foo_bar__baz' string with multi-character '__' delimiter", () => {
      expect(splitStringByLastDelimiter("foo_bar__baz", "__")).toEqual(["foo_bar", "baz"])
    })
  })

  describe("parseMultiValueInputString", () => {
    test("Splits on commas, whitespace, and newlines", () => {
      expect(parseMultiValueInputString("123, 456\n789  101112")).toEqual(["123", "456", "789", "101112"])
    })

    test("Trims and removes empties", () => {
      expect(parseMultiValueInputString("  123 ,  , ,456   ")).toEqual(["123", "456"])
    })

    test("Dedupes repeated values, preserving first occurrence order", () => {
      expect(parseMultiValueInputString("123, 456, 123, 789, 456")).toEqual(["123", "456", "789"])
    })

    test("Returns empty array for empty or whitespace-only input", () => {
      expect(parseMultiValueInputString("")).toEqual([])
      expect(parseMultiValueInputString("   \n  \t ")).toEqual([])
    })
  })
})
