import { act } from "@testing-library/react"
import { render } from "../test/utils"
import { usePage } from "../hooks/usePage"
import { PageProvider } from "./PageProvider"

const PageProbe = () => {
  const [pageState, setPageState] = usePage()

  return (
    <button
      type="button"
      data-title={pageState.title ?? ""}
      data-show-search={String(pageState.showSearch ?? false)}
      onClick={() => setPageState({ showSearch: true, title: "Campaigns" })}
    >
      probe
    </button>
  )
}

describe("PageProvider.tsx", () => {
  test("starts with an empty page state", () => {
    const result = render(
      <PageProvider>
        <PageProbe />
      </PageProvider>,
    )

    const probe = result.getByRole("button")
    expect(probe.dataset.title).toBe("")
    expect(probe.dataset.showSearch).toBe("false")
  })

  test("propagates state updates to consumers", () => {
    const result = render(
      <PageProvider>
        <PageProbe />
      </PageProvider>,
    )

    const probe = result.getByRole("button")
    act(() => {
      probe.click()
    })

    expect(probe.dataset.title).toBe("Campaigns")
    expect(probe.dataset.showSearch).toBe("true")
  })

  test("consumers outside a provider fall back to the default context value", () => {
    const result = render(<PageProbe />)

    const probe = result.getByRole("button")
    expect(probe.dataset.title).toBe("")
    expect(probe.dataset.showSearch).toBe("false")
  })
})
