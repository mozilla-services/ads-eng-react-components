import "@testing-library/jest-dom"
import { screen, waitFor } from "@testing-library/react"
import { render } from "../../test/utils"
import { PageProvider } from "../../providers/PageProvider"
import { usePage } from "../../hooks/usePage"
import { EmbeddedPage, Page } from "./Page"

/**
 * `<Helmet />` writes `document.title` asynchronously, so every assertion on it has to poll.
 * The sentinel makes "never updated" distinguishable from "updated to an empty string" —
 * which is a real expected outcome when neither part of the title is set.
 */
const TITLE_SENTINEL = "__unset__"

async function expectDocumentTitle(expected: string) {
  await waitFor(() => {
    expect(document.title).toBe(expected)
  })
}

function renderPage(
  { baseTitle, title }: { baseTitle?: string, title?: string },
) {
  document.title = TITLE_SENTINEL
  return render(
    <PageProvider baseTitle={baseTitle}>
      <Page title={title}>content</Page>
    </PageProvider>,
  )
}

describe("<Page /> document title", () => {
  afterEach(() => {
    document.title = ""
  })

  test("joins the provider's baseTitle and the page title with a colon", async () => {
    renderPage({ baseTitle: "Ads Ops", title: "Campaigns" })
    await expectDocumentTitle("Ads Ops: Campaigns")
  })

  test("uses the page title alone when the provider has no baseTitle", async () => {
    renderPage({ title: "Campaigns" })
    await expectDocumentTitle("Campaigns")
  })

  test("uses baseTitle alone when the page has no title", async () => {
    renderPage({ baseTitle: "Ads Ops" })
    await expectDocumentTitle("Ads Ops")
  })

  /**
   * With neither part set the composed title is `""`, and Helmet treats an empty title as
   * "nothing to set" rather than clearing the existing one — so the tab keeps whatever was
   * there before (the previous page, or `index.html`). Worth pinning: it means a titleless
   * `<Page />` does *not* reset the tab, which only shows up in apps with no `baseTitle`.
   */
  test("leaves the existing document title alone when neither part is set", async () => {
    renderPage({})

    // Poll for a while to be sure this is Helmet declining to write, not a slow write.
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(document.title).toBe(TITLE_SENTINEL)
  })

  test("treats an empty-string page title as absent rather than emitting a bare separator", async () => {
    renderPage({ baseTitle: "Ads Ops", title: "" })
    await expectDocumentTitle("Ads Ops")
  })

  test("updates the title when the page title changes", async () => {
    document.title = TITLE_SENTINEL
    const { rerender } = render(
      <PageProvider baseTitle="Ads Ops">
        <Page title="Campaigns">content</Page>
      </PageProvider>,
    )
    await expectDocumentTitle("Ads Ops: Campaigns")

    rerender(
      <PageProvider baseTitle="Ads Ops">
        <Page title="Line Items">content</Page>
      </PageProvider>,
    )
    await expectDocumentTitle("Ads Ops: Line Items")
  })

  test("falls back to the page title alone outside a PageProvider", async () => {
    document.title = TITLE_SENTINEL
    render(<Page title="Campaigns">content</Page>)
    await expectDocumentTitle("Campaigns")
  })

  test("renders its children", () => {
    const result = renderPage({ baseTitle: "Ads Ops", title: "Campaigns" })
    expect(result.getByText("content")).toBeInTheDocument()
  })
})

describe("<Page /> page state", () => {
  const PageStateProbe = () => {
    const [pageState] = usePage()
    return (
      <span
        data-base-title={pageState.baseTitle ?? ""}
        data-show-search={String(pageState.showSearch ?? false)}
        data-title={pageState.title ?? ""}
      >
        probe
      </span>
    )
  }

  test("publishes title and showSearch into PageContext", async () => {
    const result = render(
      <PageProvider baseTitle="Ads Ops">
        <Page showSearch title="Campaigns">content</Page>
        <PageStateProbe />
      </PageProvider>,
    )

    await waitFor(() => {
      const probe = result.getByText("probe")
      expect(probe.dataset.title).toBe("Campaigns")
      expect(probe.dataset.showSearch).toBe("true")
    })
  })

  /**
   * `Page` writes to context with `setPage({ ...page, showSearch, title })`, so the spread has
   * to carry `baseTitle` through — otherwise navigating to any page would wipe it and every
   * subsequent title would lose its prefix.
   */
  test("preserves the provider's baseTitle when publishing its own state", async () => {
    const result = render(
      <PageProvider baseTitle="Ads Ops">
        <Page title="Campaigns">content</Page>
        <PageStateProbe />
      </PageProvider>,
    )

    await waitFor(() => {
      const probe = result.getByText("probe")
      expect(probe.dataset.title).toBe("Campaigns")
      expect(probe.dataset.baseTitle).toBe("Ads Ops")
    })
  })
})

describe("<EmbeddedPage />", () => {
  it("renders iframe with correct src URL", () => {
    render(<EmbeddedPage href="/allocation" title="Allocation" />)

    const iframe = screen.getByTitle("Allocation")
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute("src", "/allocation")
  })

  it("preserves query params in path", () => {
    render(<EmbeddedPage href="http://localhost/allocation?foo=bar" title="Allocation" />)

    const iframe = screen.getByTitle("Allocation") as HTMLIFrameElement
    expect(iframe.src).toBe("http://localhost/allocation?foo=bar")
  })

  it("shows loading indicator initially", () => {
    render(<EmbeddedPage href="/preview" />)

    const progressBar = document.querySelector(".MuiCircularProgress-root")
    expect(progressBar).toBeInTheDocument()
  })

  it("hides loading indicator after iframe loads", async () => {
    const { container } = render(<EmbeddedPage href="/allocation" title="Allocation" />)

    const iframe = screen.getByTitle("Allocation") as HTMLIFrameElement

    // Simulate iframe load event
    iframe.dispatchEvent(new Event("load"))

    await waitFor(() => {
      const progressBar = container.querySelector(".MuiCircularProgress-root")
      expect(progressBar).not.toBeInTheDocument()
    })
  })

  it("applies correct dimensions to iframe", () => {
    render(<EmbeddedPage href="/allocation" title="Allocation" />)

    const iframe = screen.getByTitle("Allocation") as HTMLIFrameElement
    expect(iframe).toHaveStyle({
      width: "100%",
      height: "100%",
    })
  })

  it("iframe starts with visibility: hidden", () => {
    render(<EmbeddedPage href="/allocation" title="Allocation" />)

    const iframe = screen.getByTitle("Allocation") as HTMLIFrameElement
    expect(iframe).toHaveStyle({ visibility: "hidden" })
  })

  it("sets proper accessibility attributes", () => {
    render(<EmbeddedPage href="/allocation" title="Allocation" />)

    const iframe = screen.getByTitle("Allocation")
    expect(iframe).toHaveAttribute("aria-label", "Embedded Page: Allocation")
  })

  it("handles root path correctly", () => {
    render(<EmbeddedPage href="/" title="Home" />)

    const iframe = screen.getByTitle("Home")
    expect(iframe).toHaveAttribute("src", "/")
  })
})
