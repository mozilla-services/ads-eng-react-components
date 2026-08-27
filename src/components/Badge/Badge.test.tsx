import { render } from "../../test/utils"

import { Badge } from "./Badge"

describe("Badge.tsx", () => {
  test("<Badge /> renders children", () => {
    const result = render(
      <Badge badgeContent={4}>Foo</Badge>,
    )

    expect(result.getByText("Foo")).toBeInTheDocument()
    expect(result.getByText("4")).toBeInTheDocument()
  })

  test("<Badge /> defaults to the primary color and allows overriding it", () => {
    const primary = render(<Badge badgeContent={1} />)
    expect(primary.container.querySelector(".MuiBadge-colorPrimary")).toBeInTheDocument()

    const error = render(<Badge badgeContent={1} color="error" />)
    expect(error.container.querySelector(".MuiBadge-colorError")).toBeInTheDocument()
  })
})
