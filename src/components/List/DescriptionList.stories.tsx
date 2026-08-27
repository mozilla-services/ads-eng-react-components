import type { Meta, StoryObj } from "@storybook/react-vite"

import { DescriptionList, DescriptionListItem } from "./DescriptionList"
import { Grid, Paper } from "../Layout/Layout"
import { ExternalLinkOrNone } from "../Link/Link"
import { Chip } from "../Chip/Chip"

/**
 * A real `<dl>` for key/value detail panels. Each item renders a `<dt>`/`<dd>` pair, and an
 * empty title or body falls back to a non-breaking space so rows keep their height instead of
 * collapsing.
 *
 * `DescriptionList` renders only children whose `baseType` is `DescriptionListItem`.
 * `size` is a responsive MUI grid size, defaulting to `{ xs: 12, md: 6 }`.
 */
const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Paper variant="outlined" sx={{ maxWidth: 720, p: 2 }}>
        <Grid container><Story /></Grid>
      </Paper>
    ),
  ],
} satisfies Meta<typeof DescriptionList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DescriptionList>
      <DescriptionListItem title="Common name">Mozilla</DescriptionListItem>
      <DescriptionListItem title="Type">Direct</DescriptionListItem>
      <DescriptionListItem title="Industry">Technology</DescriptionListItem>
    </DescriptionList>
  ),
}

/** Two lists side by side is the usual detail-panel layout at `md` and up. */
export const TwoColumns: Story = {
  render: () => (
    <>
      <DescriptionList>
        <DescriptionListItem title="Common name">Mozilla</DescriptionListItem>
        <DescriptionListItem title="Boostr account">4412</DescriptionListItem>
      </DescriptionList>
      <DescriptionList>
        <DescriptionListItem title="Equativ advertiser">88213</DescriptionListItem>
        <DescriptionListItem title="Status">Active</DescriptionListItem>
      </DescriptionList>
    </>
  ),
}

/** `size` overrides the default `{ xs: 12, md: 6 }` — here a single full-width column. */
export const FullWidth: Story = {
  render: () => (
    <DescriptionList size={{ xs: 12, md: 12 }}>
      <DescriptionListItem title="Notes">
        Flight extended through Q2 at the advertiser&apos;s request.
      </DescriptionListItem>
    </DescriptionList>
  ),
}

/** Bodies can be any node, not just text. */
export const WithRichValues: Story = {
  render: () => (
    <DescriptionList>
      <DescriptionListItem title="Status">
        <Chip color="success" label="Live" size="small" />
      </DescriptionListItem>
      <DescriptionListItem title="Equativ">
        <ExternalLinkOrNone href="https://example.com/equativ/88213">EQ-88213</ExternalLinkOrNone>
      </DescriptionListItem>
      <DescriptionListItem title="Agency">
        <ExternalLinkOrNone href={null}>Unset</ExternalLinkOrNone>
      </DescriptionListItem>
    </DescriptionList>
  ),
}

/** An empty title or body renders a non-breaking space, so the row keeps its height. */
export const EmptyValues: Story = {
  render: () => (
    <DescriptionList>
      <DescriptionListItem title="Has a value">Mozilla</DescriptionListItem>
      <DescriptionListItem title="Empty body">{null}</DescriptionListItem>
      <DescriptionListItem title="">Empty title</DescriptionListItem>
    </DescriptionList>
  ),
}
