import "@testing-library/jest-dom"
import { render } from "../../test/utils"
import React from "react"

import { Popover, PopoverHandle } from "./Popover"

describe("Popover.tsx", () => {
  test("renders the <Popover /> component that exposes a `PopoverHandle` interface via its `ref`", () => {
    const popoverRef = React.createRef<PopoverHandle>()
    const anchorRef = React.createRef<HTMLElement>()
    render(
      <Popover ref={popoverRef} anchorRef={anchorRef}>Test</Popover>,
    )
    expect(popoverRef.current?.open).toBeInstanceOf(Function)
    expect(popoverRef.current?.close).toBeInstanceOf(Function)
  })
})
