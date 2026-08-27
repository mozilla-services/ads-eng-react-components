import { act } from "@testing-library/react"
import { render } from "../test/utils"
import { usePage } from "../hooks/usePage"
import { PageProvider } from "./PageProvider"

const PageProbe = () => {
  const [pageState, setPageState] = usePage()

  return (
    <button
      type="button"
      data-base-title={pageState.baseTitle ?? ""}
      data-title={pageState.title ?? ""}
      data-show-search={String(pageState.showSearch ?? false)}
      onClick={() => setPageState({ ...pageState, showSearch: true, title: "Campaigns" })}
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

  describe("baseTitle", () => {
    test("seeds PageContext with the baseTitle prop", () => {
      const result = render(
        <PageProvider baseTitle="Ads Ops">
          <PageProbe />
        </PageProvider>,
      )

      expect(result.getByRole("button").dataset.baseTitle).toBe("Ads Ops")
    })

    test("leaves baseTitle unset when the prop is omitted", () => {
      const result = render(
        <PageProvider>
          <PageProbe />
        </PageProvider>,
      )

      expect(result.getByRole("button").dataset.baseTitle).toBe("")
    })

    test("survives a consumer writing unrelated page state", () => {
      const result = render(
        <PageProvider baseTitle="Ads Ops">
          <PageProbe />
        </PageProvider>,
      )

      const probe = result.getByRole("button")
      act(() => {
        probe.click()
      })

      expect(probe.dataset.title).toBe("Campaigns")
      expect(probe.dataset.baseTitle).toBe("Ads Ops")
    })

    /**
     * `baseTitle` seeds `useState`, so it is read once on mount and later prop changes are
     * ignored. That suits its intended use — set once at the app root — but means it can't be
     * driven by state. Pinned so the limitation is deliberate rather than surprising.
     */
    test("is a one-time seed, not reactive to later prop changes", () => {
      const result = render(
        <PageProvider baseTitle="First">
          <PageProbe />
        </PageProvider>,
      )
      expect(result.getByRole("button").dataset.baseTitle).toBe("First")

      result.rerender(
        <PageProvider baseTitle="Second">
          <PageProbe />
        </PageProvider>,
      )
      expect(result.getByRole("button").dataset.baseTitle).toBe("First")
    })
  })
})
