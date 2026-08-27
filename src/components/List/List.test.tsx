import { fireEvent } from "@testing-library/react"
import { render } from "../../test/utils"

import { List, ListItem } from "./List"

describe("List.tsx", () => {
  test("<List /> renders its <ListItem /> children", () => {
    const result = render(
      <List>
        <ListItem title="Foo" />
        <ListItem title="Bar" />
      </List>,
    )

    expect(result.getByText("Foo")).toBeInTheDocument()
    expect(result.getByText("Bar")).toBeInTheDocument()
  })

  test("<List /> ignores children that are not <ListItem />", () => {
    const result = render(
      <List>
        <ListItem title="Foo" />
        <span>Nope</span>
      </List>,
    )

    expect(result.getByText("Foo")).toBeInTheDocument()
    expect(result.queryByText("Nope")).not.toBeInTheDocument()
  })

  test("<ListItem /> renders secondary content", () => {
    const result = render(
      <List>
        <ListItem title="Foo">Secondary</ListItem>
      </List>,
    )

    expect(result.getByText("Secondary")).toBeInTheDocument()
  })

  test("<ListItem /> becomes interactive when given an `onClick`", () => {
    const onClick = jest.fn()
    const result = render(
      <List>
        <ListItem title="Foo" onClick={onClick} />
      </List>,
    )

    fireEvent.click(result.getByText("Foo"))
    expect(onClick).toHaveBeenCalled()
  })

  test("<ListItem /> renders an accessory and an icon", () => {
    const result = render(
      <List>
        <ListItem title="Foo" accessory={<span>Acc</span>} icon={<span>Ico</span>} />
      </List>,
    )

    expect(result.getByText("Acc")).toBeInTheDocument()
    expect(result.getByText("Ico")).toBeInTheDocument()
  })

  test("<ListItem /> renders a dot badge for a boolean `iconBadge`", () => {
    const result = render(
      <List>
        <ListItem title="Foo" icon={<span>Ico</span>} iconBadge />
      </List>,
    )

    expect(result.baseElement.querySelector(".MuiBadge-dot")).toBeInTheDocument()
  })

  test("<ListItem /> renders badge content for a non-boolean `iconBadge`", () => {
    const result = render(
      <List>
        <ListItem title="Foo" icon={<span>Ico</span>} iconBadge={7} />
      </List>,
    )

    expect(result.getByText("7")).toBeInTheDocument()
  })
})
