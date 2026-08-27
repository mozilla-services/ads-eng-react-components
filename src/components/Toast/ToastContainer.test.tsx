import { act, waitFor } from "@testing-library/react"
import { toast } from "react-toastify"
import { render } from "../../test/utils"
import { ThemeProvider } from "../../providers/ThemeProvider"

import { ToastContainer } from "./ToastContainer"

// react-toastify only renders its inner container once a toast is queued, so each
// assertion about position/theme has to fire one first.
async function showToast(message: string) {
  await act(async () => {
    toast(message)
  })
}

describe("ToastContainer.tsx", () => {
  beforeEach(() => {
    window.localStorage.clear()
    toast.dismiss()
  })

  test("renders the toastify root", () => {
    const result = render(<ToastContainer />)

    expect(result.baseElement.querySelector(".Toastify")).toBeInTheDocument()
  })

  test("displays a queued toast", async () => {
    const result = render(<ToastContainer />)
    await showToast("Saved")

    await waitFor(() => {
      expect(result.getByText("Saved")).toBeInTheDocument()
    })
  })

  test("defaults to the light theme outside a <ThemeProvider />", async () => {
    const result = render(<ToastContainer />)
    await showToast("Saved")

    await waitFor(() => {
      expect(result.baseElement.querySelector(".Toastify__toast-theme--light")).toBeInTheDocument()
    })
  })

  test("follows the theme mode from <ThemeProvider />", async () => {
    window.localStorage.setItem("themeSettings", JSON.stringify({ mode: "dark" }))

    const result = render(
      <ThemeProvider>
        <ToastContainer />
      </ThemeProvider>,
    )
    await showToast("Saved")

    await waitFor(() => {
      expect(result.baseElement.querySelector(".Toastify__toast-theme--dark")).toBeInTheDocument()
    })
  })

  test("forwards props through to toastify", async () => {
    const result = render(<ToastContainer position="bottom-left" />)
    await showToast("Saved")

    await waitFor(() => {
      expect(result.baseElement.querySelector(".Toastify__toast-container--bottom-left")).toBeInTheDocument()
    })
  })
})
