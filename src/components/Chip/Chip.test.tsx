import { fireEvent } from "@testing-library/react"
import { render } from "../../test/utils"

import {
  ActionChip,
} from "./Chip"

describe("ActionChip.tsx", () => {
  test("<ActionChip /> renders label", () => {
    const result = render(
      <ActionChip label="Foo" />,
    )

    expect(result.queryByText("Foo")).toBeInstanceOf(HTMLSpanElement)
  })

  test("<ActionChip /> triggers onAction callback when clicking the action icon", () => {
    const onActionMock = jest.fn()

    const result = render(
      <ActionChip label="Foo" onAction={onActionMock} />,
    )

    const actionChip = result.queryByRole("button")
    const actionIcon = actionChip?.querySelector(".MuiSvgIcon-root")
    fireEvent.click(actionIcon ?? globalThis.window)

    expect(onActionMock).toHaveBeenCalled()
  })
})
