import { Campaign, Public, Storefront } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { List, ListItem } from "./List"
import { Chip } from "../Chip/Chip"
import { Paper } from "../Layout/Layout"

/**
 * A navigation list. `List` renders only children whose `baseType` is `ListItem`, inserting
 * dividers between them, and swaps in a spinner or an empty message when there's nothing to
 * show.
 *
 * A `ListItem` is only interactive when it has an `href` or `onClick` — otherwise pointer
 * events are disabled so it reads as a plain row rather than a dead button. The `accessory`
 * width is measured on mount and reserved so the title ellipsizes against it.
 */
const meta = {
  title: "Components/List",
  component: List,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Paper variant="outlined" sx={{ maxWidth: 420 }}>
        <Story />
      </Paper>
    ),
  ],
} satisfies Meta<typeof List>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <List>
      <ListItem href="/advertisers/1" title="Mozilla" />
      <ListItem href="/advertisers/2" title="Thunderbird" />
      <ListItem href="/advertisers/3" title="Pocket" />
    </List>
  ),
}

export const WithSecondaryText: Story = {
  render: () => (
    <List>
      <ListItem href="/campaigns/1" title="Q1 Brand">12 line items · New Tab</ListItem>
      <ListItem href="/campaigns/2" title="Q1 Performance">4 line items · Homepage</ListItem>
    </List>
  ),
}

export const Selected: Story = {
  render: () => (
    <List>
      <ListItem href="/advertisers/1" selected title="Mozilla" />
      <ListItem href="/advertisers/2" title="Thunderbird" />
    </List>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <List>
      <ListItem href="/a" icon={<Storefront />} title="Advertisers" />
      <ListItem href="/b" icon={<Campaign />} title="Campaigns" />
      <ListItem href="/c" icon={<Public />} title="Surfaces" />
    </List>
  ),
}

/** A boolean `iconBadge` shows a dot; any other value renders as badge content. */
export const WithIconBadges: Story = {
  render: () => (
    <List>
      <ListItem href="/a" icon={<Campaign />} iconBadge title="Dot badge" />
      <ListItem href="/b" icon={<Campaign />} iconBadge={7} title="Count badge" />
      <ListItem href="/c" icon={<Campaign />} title="No badge" />
    </List>
  ),
}

/** The accessory's width is reserved so a long title ellipsizes instead of colliding. */
export const WithAccessory: Story = {
  render: () => (
    <List>
      <ListItem accessory={<Chip color="success" label="Live" size="small" />} href="/a" title="Q1 Brand" />
      <ListItem accessory={<Chip color="warning" label="Pending" size="small" />} href="/b" title="Q1 Performance" />
      <ListItem
        accessory={<Chip color="error" label="Failed" size="small" />}
        href="/c"
        title="A campaign with a very long name that has to ellipsize against its accessory"
      />
    </List>
  ),
}

/** `indent` steps the left padding, for hierarchy without nested lists. */
export const Indented: Story = {
  render: () => (
    <List>
      <ListItem href="/a" title="Mozilla" />
      <ListItem href="/a/1" indent={1} title="Q1 Brand" />
      <ListItem href="/a/1/1" indent={2} title="New Tab · US" />
      <ListItem href="/b" title="Thunderbird" />
    </List>
  ),
}

/** No `href` and no `onClick` — rendered as static rows. */
export const NonInteractive: Story = {
  render: () => (
    <List>
      <ListItem title="Read-only row" />
      <ListItem title="Another read-only row">With secondary text</ListItem>
    </List>
  ),
}

export const Loading: Story = {
  render: () => (
    <List loading sx={{ height: 160, position: "relative" }}>
      <ListItem title="Never rendered while loading" />
    </List>
  ),
}

export const Empty: Story = {
  render: () => <List emptyMessage="No advertisers match this filter." />,
}

export const WithoutDividers: Story = {
  render: () => (
    <List suppressDividers>
      <ListItem href="/a" title="Mozilla" />
      <ListItem href="/b" title="Thunderbird" />
      <ListItem href="/c" title="Pocket" />
    </List>
  ),
}
