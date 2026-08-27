import { render } from "../../test/utils"

import {
  AppLoader,
} from "./AppLoader"

describe("AppLoader.tsx", () => {
  test("<AppLoader /> renders a <MuiCircularProgress-root /> component", () => {
    const result = render(
      <AppLoader />,
    )

    const rootElement = result.baseElement.querySelector<HTMLDivElement>(".MuiBox-root")!
    expect(rootElement).toBeInstanceOf(HTMLDivElement)

    const circularProgressElement = rootElement.querySelector<HTMLSpanElement>(".MuiCircularProgress-root")!
    expect(circularProgressElement).toBeInstanceOf(HTMLSpanElement)
  })
})
