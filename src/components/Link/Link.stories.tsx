import type { Meta, StoryObj } from "@storybook/react-vite"

import { BackLink, ExternalLink, ExternalLinkOrNone } from "./Link"
import { Stack, Typography } from "../Layout/Layout"
import { getUrlForEmailAddress } from "../../utils/urls"

/**
 * `BackLink` prefers real history: if there's something to go back to it renders an anchor
 * that calls `navigate(-1)`, and otherwise falls back to a router link to `to`. Under
 * Storybook's `MemoryRouter` there's no prior entry, so it renders the fallback.
 *
 * `ExternalLink` appends a newline via `::after`, which keeps a run of links breaking onto
 * separate lines inside a table cell. `ExternalLinkOrNone` renders `(none)` — or its children
 * as plain text — when there's no `href`.
 */
const meta = {
  title: "Components/Link",
  component: ExternalLink,
  tags: ["autodocs"],
  args: {
    children: "Open in Equativ",
    href: "https://example.com/equativ/line-items/88213",
  },
} satisfies Meta<typeof ExternalLink>

export default meta

type Story = StoryObj<typeof meta>

export const External: Story = {}

/** The `::after` newline is why consecutive links stack rather than running together. */
export const ExternalStacks: Story = {
  render: () => (
    <Typography component="div" variant="body2">
      <ExternalLink href="https://example.com/a" rel="noreferrer" target="_blank">Placement A</ExternalLink>
      <ExternalLink href="https://example.com/b" rel="noreferrer" target="_blank">Placement B</ExternalLink>
      <ExternalLink href="https://example.com/c" rel="noreferrer" target="_blank">Placement C</ExternalLink>
    </Typography>
  ),
}

/** Pairs with `getUrlForEmailAddress()`, which accepts `"Name <addr>"` too. */
export const ExternalMailto: Story = {
  args: {
    children: "adops@example.com",
    href: getUrlForEmailAddress("Ad Ops <adops@example.com>"),
  },
}

/** `ExternalLinkOrNone` degrades to `(none)` rather than an empty cell. */
export const OrNone: Story = {
  render: () => (
    <Stack spacing={1}>
      <div>
        <Typography component="span" variant="body2">With href: </Typography>
        <ExternalLinkOrNone href="https://example.com/equativ/88213">EQ-88213</ExternalLinkOrNone>
      </div>
      <div>
        <Typography component="span" variant="body2">Null href: </Typography>
        <ExternalLinkOrNone href={null}>EQ-88213</ExternalLinkOrNone>
      </div>
      <div>
        <Typography component="span" variant="body2">No children: </Typography>
        <ExternalLinkOrNone href="https://example.com">{null}</ExternalLinkOrNone>
      </div>
    </Stack>
  ),
}

/** No history under `MemoryRouter`, so this renders the router-link fallback to `to`. */
export const Back: Story = {
  render: () => <BackLink to="/campaigns">← Back to campaigns</BackLink>,
}
