import "@testing-library/jest-dom"
import { createEvent, fireEvent, screen, waitFor } from "@testing-library/react"
import { render, sleep } from "../../test/utils"

import { Dialog } from "./Dialog"

describe("Dialog.tsx", () => {
  test("renders the <Dialog /> component with the correct label", () => {
    const title = "Test Title"
    render(
      <Dialog keepMounted title={title} />,
    )
    expect(screen.getByLabelText(/Test Title/i)).toBeInTheDocument()
  })

  test("renders the <Dialog /> component with a 'Cancel' button", () => {
    const result = render(
      <Dialog keepMounted title="Dialog" />,
    )

    const buttonElement = result.getByText("Cancel")
    expect(buttonElement).toBeInstanceOf(HTMLButtonElement)

    const mockClickEvent = createEvent.click(buttonElement)
    fireEvent(buttonElement, mockClickEvent)
  })

  test("renders the <Dialog /> component with a 'Cancel' button that invokes the callbacks", async () => {
    const onActionMock = jest.fn()
    const onCloseMock = jest.fn()

    const result = render(
      <Dialog keepMounted title="Dialog" onAction={onActionMock} onClose={onCloseMock} />,
    )

    const buttonElement = result.getByText("Cancel")
    expect(buttonElement).toBeInstanceOf(HTMLButtonElement)

    const mockClickEvent = createEvent.click(buttonElement)
    fireEvent(buttonElement, mockClickEvent)

    await waitFor(async () => {
      await sleep(100)
      expect(onActionMock).toHaveBeenCalledWith("close")
      expect(onCloseMock).toHaveBeenCalled()
    })
  })

  test("renders the <Dialog /> component with a 'Cancel' button that closes on error", async () => {
    const onActionMock = jest.fn()
    onActionMock.mockRejectedValue(new Error("Test error"))

    const result = render(
      <Dialog keepMounted title="Dialog" onAction={onActionMock} closeOnError />,
    )

    const buttonElement = result.getByText("Cancel")
    expect(buttonElement).toBeInstanceOf(HTMLButtonElement)

    const mockClickEvent = createEvent.click(buttonElement)
    fireEvent(buttonElement, mockClickEvent)

    await waitFor(async () => {
      await sleep(100)
      expect(onActionMock).toHaveBeenCalledWith("close")
    })
  })

  test("renders the <Dialog /> component with a 'Confirm' button", () => {
    const result = render(
      <Dialog keepMounted title="Dialog" />,
    )

    const buttonElement = result.getByText("Confirm")
    expect(buttonElement).toBeInstanceOf(HTMLButtonElement)

    const mockClickEvent = createEvent.click(buttonElement)
    fireEvent(buttonElement, mockClickEvent)
  })

  test("renders the <Dialog /> component with a 'Confirm' button that invokes the callbacks", async () => {
    const onActionMock = jest.fn()

    const result = render(
      <Dialog keepMounted title="Dialog" onAction={onActionMock} />,
    )

    const buttonElement = result.getByText("Confirm")
    expect(buttonElement).toBeInstanceOf(HTMLButtonElement)

    const mockClickEvent = createEvent.click(buttonElement)
    fireEvent(buttonElement, mockClickEvent)

    await waitFor(async () => {
      await sleep(100)
      expect(onActionMock).toHaveBeenCalledWith("primary")
    })
  })

  test("renders the <Dialog /> component with a 'Confirm' button that closes on error", async () => {
    const onActionMock = jest.fn()
    onActionMock.mockRejectedValue(new Error("Test error"))

    const result = render(
      <Dialog keepMounted title="Dialog" onAction={onActionMock} closeOnError />,
    )

    const buttonElement = result.getByText("Confirm")
    expect(buttonElement).toBeInstanceOf(HTMLButtonElement)

    const mockClickEvent = createEvent.click(buttonElement)
    fireEvent(buttonElement, mockClickEvent)

    await waitFor(async () => {
      await sleep(100)
      expect(onActionMock).toHaveBeenCalledWith("primary")
    })
  })
})
