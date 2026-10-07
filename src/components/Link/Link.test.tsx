import "@testing-library/jest-dom"
import { render } from "../../test/utils"

import {
  BackLink,
  ExternalLink,
  ExternalLinkOrNone,
  Link,
} from "./Link"

describe("Link.tsx", () => {
  test("<BackLink /> renders a hyperlink", () => {
    const result = render(
      <BackLink to="/foo/bar">Foo</BackLink>,
    )

    const link = result.baseElement.querySelector("a")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
  })

  test("<Link /> renders a hyperlink with the specified `[href]`", () => {
    const result = render(
      <Link href="/foo/bar">Foo</Link>,
    )

    const link = result.baseElement.querySelector("a")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link).toHaveAttribute("href", "/foo/bar")
    expect(link).toHaveTextContent("Foo")
  })

  test("<ExternalLink /> and <ExternalLinkOrNone /> share the `baseType` of <Link />", () => {
    expect(Link.baseType).toBe(Symbol.for("Link"))
    expect(ExternalLink.baseType).toBe(Link.baseType)
    expect(ExternalLinkOrNone.baseType).toBe(Link.baseType)
  })

  test("<ExternalLink /> renders a hyperlink with the specified `[href]`", () => {
    const result = render(
      <ExternalLink href="/foo/bar">Foo</ExternalLink>,
    )

    const link = result.baseElement.querySelector("a")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
  })

  test("<ExternalLinkOrNone /> renders a hyperlink with the specified `[href]`", () => {
    const result = render(
      <ExternalLinkOrNone href="/foo/bar">Foo</ExternalLinkOrNone>,
    )

    const link = result.baseElement.querySelector("a")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
  })

  test("<ExternalLinkOrNone /> renders an empty container with \"(none)\" content", () => {
    const result = render(
      <ExternalLinkOrNone href="/foo/bar" />,
    )

    const link = result.baseElement.querySelector("a")
    expect(link).toBeNull()
    expect(result.baseElement.firstChild?.textContent).toEqual("(none)")
  })
})
