import { render } from "../../test/utils"

import { SplitLayout } from "./SplitLayout"

describe("SplitLayout.tsx", () => {
  test("renders both panels", () => {
    const result = render(
      <SplitLayout>
        <div>Nav</div>
        <div>Main</div>
      </SplitLayout>,
    )

    expect(result.getByText("Nav")).toBeInTheDocument()
    expect(result.getByText("Main")).toBeInTheDocument()
  })

  test("treats the second child as the nav when `rightSideNav` is set", () => {
    const result = render(
      <SplitLayout rightSideNav>
        <div>Main</div>
        <div>Nav</div>
      </SplitLayout>,
    )

    // Both still render; `rightSideNav` only swaps which child fills which panel.
    expect(result.getByText("Nav")).toBeInTheDocument()
    expect(result.getByText("Main")).toBeInTheDocument()
  })

  test("renders with resizing disabled", () => {
    const result = render(
      <SplitLayout disableResizing>
        <div>Nav</div>
        <div>Main</div>
      </SplitLayout>,
    )

    expect(result.getByText("Nav")).toBeInTheDocument()
  })

  test("accepts percentage sizes, which switch the panels to relative resizing", () => {
    const result = render(
      <SplitLayout navDefaultSize="30%" mainDefaultSize="70%" minHeight="10rem">
        <div>Nav</div>
        <div>Main</div>
      </SplitLayout>,
    )

    expect(result.getByText("Main")).toBeInTheDocument()
  })

  test("accepts explicit pixel sizes and min/max bounds", () => {
    const result = render(
      <SplitLayout
        navDefaultSize={200}
        navMinSize={100}
        navMaxSize={400}
        mainDefaultSize={600}
        mainMinSize={200}
        mainMaxSize={900}
      >
        <div>Nav</div>
        <div>Main</div>
      </SplitLayout>,
    )

    expect(result.getByText("Main")).toBeInTheDocument()
  })
})
