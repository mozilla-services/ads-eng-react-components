import { filterChildrenByBaseComponent, getTextContentFromNode } from "./components"

// These stubs exist only to carry a `baseType`; `filterChildrenByBaseComponent` matches on
// that symbol, never on props or rendered output.
const Widget: ExtendableComponent = () => <span>widget</span>
Widget.displayName = "Widget"
Widget.baseType = Symbol.for("Widget")

// Shares Widget's `baseType`, the way ActionChip shares Chip's.
const WidgetVariant: ExtendableComponent = () => <span>variant</span>
WidgetVariant.displayName = "WidgetVariant"
WidgetVariant.baseType = Widget.baseType

const Other: ExtendableComponent = () => <span>other</span>
Other.displayName = "Other"
Other.baseType = Symbol.for("Other")

describe("components.ts", () => {
  describe("filterChildrenByBaseComponent()", () => {
    test("keeps children sharing the base component's `baseType`", () => {
      const result = filterChildrenByBaseComponent(Widget, [
        <Widget key="a" />,
        <WidgetVariant key="b" />,
      ])

      expect(result).toHaveLength(2)
    })

    test("drops children with a different `baseType`", () => {
      const result = filterChildrenByBaseComponent(Widget, [
        <Widget key="a" />,
        <Other key="b" />,
      ])

      expect(result).toHaveLength(1)
    })

    test("drops plain elements and text nodes", () => {
      const result = filterChildrenByBaseComponent(Widget, [<span key="a">a</span>, "text", 42])
      expect(result).toHaveLength(0)
    })

    test("returns an empty array for undefined children", () => {
      expect(filterChildrenByBaseComponent(Widget, undefined)).toEqual([])
    })
  })

  describe("getTextContentFromNode()", () => {
    test("returns a plain string unchanged", () => {
      expect(getTextContentFromNode("foo")).toBe("foo")
    })

    test("stringifies numbers", () => {
      expect(getTextContentFromNode(42)).toBe("42")
    })

    test("concatenates nested element text", () => {
      expect(getTextContentFromNode(
        <span>
          foo
          <b>bar</b>
        </span>,
      )).toBe("foobar")
    })

    test("joins with the given delimiter", () => {
      expect(getTextContentFromNode(["foo", "bar"], "-")).toBe("foo-bar")
    })

    test("returns an empty string for undefined", () => {
      expect(getTextContentFromNode(undefined)).toBe("")
    })

    test("skips nodes with no text content", () => {
      expect(getTextContentFromNode(<span />)).toBe("")
    })
  })
})
