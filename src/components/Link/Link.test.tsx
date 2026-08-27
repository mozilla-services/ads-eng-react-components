import "@testing-library/jest-dom"
import { render } from "../../test/utils"

import {
  BackLink,
  ExternalLink,
  ExternalLinkOrNone,
} from "./Link"

describe("Link.tsx", () => {
  test("<BackLink /> renders a hyperlink", () => {
    const result = render(
      <BackLink to="/foo/bar">Foo</BackLink>,
    )

    const link = result.baseElement.querySelector("a")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
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
