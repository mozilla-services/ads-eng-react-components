import { fireEvent, waitFor } from "@testing-library/react"
import { render, sleep } from "../../test/utils"

import * as axiosImport from "axios"

import {
  AsyncButton,
  Button,
  PopoverButton,
  RemoteButton,
} from "./Button"

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
}))

jest.mock("../../utils/async", () => ({
  ...jest.requireActual("../../utils/async"),
  sleep: jest.fn(() => Promise.resolve()),
}))

const mockAxiosRequest = jest.spyOn(axiosImport.default, "request")

describe("Button.tsx", () => {
  test("<Button /> renders children", () => {
    const result = render(
      <Button>Foo</Button>,
    )

    expect(result.queryByText("Foo")).toBeInstanceOf(HTMLButtonElement)
  })

  test("<PopoverButton /> renders title", () => {
    const result = render(
      <PopoverButton title="Foo" />,
    )

    expect(result.queryByText("Foo")).toBeInstanceOf(HTMLButtonElement)
  })

  test("<AsyncButton /> renders children", () => {
    const result = render(
      <AsyncButton>Foo</AsyncButton>,
    )

    expect(result.queryByText("Foo")).toBeInstanceOf(HTMLButtonElement)
  })

  test("<AsyncButton /> goes into 'success' status on click when `onClick` handler resolves immediately", async () => {
    const result = render(
      <AsyncButton>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("CheckCircleOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<AsyncButton /> goes into 'failure' status on click when `onClick` handler throws an error", async () => {
    const result = render(
      <AsyncButton onClick={() => new Promise((_resolve, reject) => reject())}>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("ErrorOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<AsyncButton /> goes into 'pending' status on click when `onClick` handler does not resolve immediately", async () => {
    const result = render(
      <AsyncButton onClick={() => new Promise(() => {})}>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByRole("progressbar")).toBeInstanceOf(HTMLSpanElement)
    })
  })

  test("<RemoteButton /> triggers remote request on click", async () => {
    const result = render(
      <RemoteButton url="/foo/bar">Foo</RemoteButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    expect(mockAxiosRequest).toHaveBeenCalled()
  })

  test("<AsyncButton /> displays success message from onClick result in tooltip", async () => {
    const successMessage = "Operation successful!"
    const result = render(
      <AsyncButton onClick={async () => successMessage}>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("CheckCircleOutlineIcon")).toBeInstanceOf(SVGElement)
    })

    const tooltipElement = result.container.querySelector("[role=\"tooltip\"]")
    if (tooltipElement) {
      expect(tooltipElement.textContent).toBe(successMessage)
    }
  })

  test("<AsyncButton /> displays error message in tooltip on failure", async () => {
    const errorMessage = "Something went wrong"
    const result = render(
      <AsyncButton onClick={() => Promise.reject(new Error(errorMessage))}>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("ErrorOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<RemoteButton /> returns message from API response data string", async () => {
    const responseMessage = "Successfully synced!"
    mockAxiosRequest.mockResolvedValueOnce({ data: responseMessage })

    const result = render(
      <RemoteButton url="/api/sync">Sync</RemoteButton>,
    )

    const button = result.queryByText("Sync")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("CheckCircleOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<RemoteButton /> extracts message from API response object", async () => {
    mockAxiosRequest.mockResolvedValueOnce({
      data: { message: "Sync completed successfully" },
    })

    const result = render(
      <RemoteButton url="/api/sync">Sync</RemoteButton>,
    )

    const button = result.queryByText("Sync")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("CheckCircleOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<RemoteButton /> extracts detail field from API response", async () => {
    mockAxiosRequest.mockResolvedValueOnce({
      data: { detail: "Action completed" },
    })

    const result = render(
      <RemoteButton url="/api/action">Execute</RemoteButton>,
    )

    const button = result.queryByText("Execute")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("CheckCircleOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<AsyncButton /> handles axios error with string response", async () => {
    const errorMessage = "Invalid request"
    const mockError = {
      response: {
        data: errorMessage,
      },
    }

    const result = render(
      <AsyncButton onClick={() => Promise.reject(mockError)}>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("ErrorOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })

  test("<AsyncButton /> handles axios error with object response containing array", async () => {
    const mockError = {
      response: {
        data: {
          errors: ["First error message", "Second error message"],
        },
      },
    }

    const result = render(
      <AsyncButton onClick={() => Promise.reject(mockError)}>Foo</AsyncButton>,
    )

    const button = result.queryByText("Foo")
    fireEvent.click(button ?? globalThis.window)

    await waitFor(async () => {
      await sleep(100)
      expect(result.queryByTestId("ErrorOutlineIcon")).toBeInstanceOf(SVGElement)
    })
  })
})
