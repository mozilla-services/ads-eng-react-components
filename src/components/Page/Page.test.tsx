import "@testing-library/jest-dom"
import { screen, waitFor } from "@testing-library/react"
import { render } from "../../test/utils"
import { EmbeddedPage } from "./Page"

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
