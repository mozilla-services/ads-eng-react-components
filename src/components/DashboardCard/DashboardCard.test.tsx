import { fireEvent } from "@testing-library/react"
import { render } from "../../test/utils"

import {
  DashboardCard,
} from "./DashboardCard"

describe("DashboardCard.tsx", () => {
  test("<DashboardCard /> renders all children for non-flippable cards", () => {
    const result = render(
      <DashboardCard>
        <div data-testid="child-1" />
        <div data-testid="child-2" />
        <div data-testid="child-3" />
      </DashboardCard>,
    )

    expect(result.queryByTestId("child-1")).toBeInstanceOf(HTMLDivElement)
    expect(result.queryByTestId("child-2")).toBeInstanceOf(HTMLDivElement)
    expect(result.queryByTestId("child-3")).toBeInstanceOf(HTMLDivElement)
  })

  test("<DashboardCard /> only renders first two children for flippable cards", () => {
    const result = render(
      <DashboardCard flippable>
        <div data-testid="front" />
        <div data-testid="back" />
        <div data-testid="other" />
      </DashboardCard>,
    )

    expect(result.queryByTestId("front")).toBeInstanceOf(HTMLDivElement)
    expect(result.queryByTestId("back")).toBeInstanceOf(HTMLDivElement)
    expect(result.queryByTestId("other")).toBeNull()
  })

  test("<DashboardCard /> wraps its entire content in an anchor link when an `href` is specified", () => {
    const result = render(
      <DashboardCard flippable href="/foo/bar">
        <div data-testid="front" />
        <div data-testid="back" />
      </DashboardCard>,
    )

    const link = result.baseElement.querySelector<HTMLAnchorElement>("a.MuiCardActionArea-root")
    fireEvent.click(link ?? globalThis.window)
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("http://localhost/foo/bar")
  })

  test("<DashboardCard /> renders the specified title", () => {
    const result = render(
      <DashboardCard flippable title="Foo">
        <div data-testid="front" />
        <div data-testid="back" />
      </DashboardCard>,
    )

    expect(result.queryAllByText("Foo").length).toEqual(2)
    expect(result.queryAllByText("Foo")[0]).toBeInstanceOf(HTMLHeadingElement)
    expect(result.queryAllByText("Foo")[1]).toBeInstanceOf(HTMLHeadingElement)
  })

  test("<DashboardCard /> flips the card when the icon button is clicked", () => {
    const result = render(
      <DashboardCard flippable title="Foo">
        <div data-testid="front" />
        <div data-testid="back" />
      </DashboardCard>,
    )

    expect(result.queryAllByTestId("FlipIcon").length).toEqual(2)
    expect(result.queryAllByTestId("FlipIcon")[0]).toBeInstanceOf(SVGElement)
    expect(result.queryAllByTestId("FlipIcon")[1]).toBeInstanceOf(SVGElement)

    expect(result.baseElement.querySelector(".flipped")).toBeNull()
    fireEvent.click(result.queryAllByTestId("FlipIcon")[0].parentElement ?? globalThis.window)
    expect(result.baseElement.querySelector(".flipped")).toBeInstanceOf(HTMLDivElement)
  })
})
