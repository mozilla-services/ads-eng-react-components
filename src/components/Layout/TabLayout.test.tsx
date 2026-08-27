import { fireEvent } from "@testing-library/react"
import { render } from "../../test/utils"

import { Tab, TabLayout } from "./TabLayout"

function renderTabs() {
  return render(
    <TabLayout>
      <Tab title="First" value="first">First content</Tab>
      <Tab title="Second" value="second">Second content</Tab>
    </TabLayout>,
  )
}

describe("TabLayout.tsx", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/")
  })

  test("renders a tab per <Tab /> child", () => {
    const result = renderTabs()

    expect(result.getByText("First")).toBeInTheDocument()
    expect(result.getByText("Second")).toBeInTheDocument()
  })

  test("selects the first tab and renders only its content", () => {
    const result = renderTabs()

    expect(result.getByText("First content")).toBeInTheDocument()
    expect(result.queryByText("Second content")).not.toBeInTheDocument()
  })

  test("writes the selected tab into the location hash", () => {
    renderTabs()

    expect(window.location.hash).toBe("#tab=first")
  })

  test("honors a tab preselected via the location hash", () => {
    window.history.replaceState(null, "", "/#tab=second")

    const result = renderTabs()

    expect(result.getByText("Second content")).toBeInTheDocument()
    expect(result.queryByText("First content")).not.toBeInTheDocument()
  })

  test("switches content when a tab is clicked", () => {
    const result = renderTabs()

    fireEvent.click(result.getByText("Second"))

    expect(result.getByText("Second content")).toBeInTheDocument()
  })

  test("ignores children that are not <Tab />", () => {
    const result = render(
      <TabLayout>
        <Tab title="First" value="first">First content</Tab>
        <span>Nope</span>
      </TabLayout>,
    )

    expect(result.getByText("First")).toBeInTheDocument()
    expect(result.queryByText("Nope")).not.toBeInTheDocument()
  })
})
