import { render } from "../../test/utils"

import { DescriptionList, DescriptionListItem } from "./DescriptionList"
import { NON_BREAKING_SPACE } from "../../utils/strings"

describe("DescriptionList.tsx", () => {
  test("<DescriptionList /> renders its items as a <dl>", () => {
    const result = render(
      <DescriptionList>
        <DescriptionListItem title="Name">Acme</DescriptionListItem>
      </DescriptionList>,
    )

    expect(result.baseElement.querySelector("dl")).toBeInTheDocument()
    expect(result.getByText("Name").tagName).toBe("DT")
    expect(result.getByText("Acme").tagName).toBe("DD")
  })

  test("<DescriptionList /> ignores children that are not <DescriptionListItem />", () => {
    const result = render(
      <DescriptionList>
        <DescriptionListItem title="Name">Acme</DescriptionListItem>
        <span>Nope</span>
      </DescriptionList>,
    )

    expect(result.getByText("Name")).toBeInTheDocument()
    expect(result.queryByText("Nope")).not.toBeInTheDocument()
  })

  test("<DescriptionList /> accepts a responsive `size`", () => {
    const result = render(
      <DescriptionList size={{ xs: 6 }}>
        <DescriptionListItem title="Name">Acme</DescriptionListItem>
      </DescriptionList>,
    )

    expect(result.baseElement.querySelector("dl")).toBeInTheDocument()
  })

  test("<DescriptionListItem /> substitutes a non-breaking space for an empty title or body", () => {
    const result = render(
      <DescriptionList>
        <DescriptionListItem title="">{null}</DescriptionListItem>
      </DescriptionList>,
    )

    const dt = result.baseElement.querySelector("dt")
    const dd = result.baseElement.querySelector("dd")
    expect(dt?.textContent).toBe(NON_BREAKING_SPACE)
    expect(dd?.textContent).toBe(NON_BREAKING_SPACE)
  })
})
