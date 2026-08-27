import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tab, TabLayout } from "./TabLayout"
import { Typography } from "./Layout"

/**
 * Tabs whose selection lives in the URL hash (`#tab=…`), so a tab is linkable and survives a
 * reload. `TabLayout` only renders children whose `baseType` is `Tab`; anything else is
 * ignored.
 *
 * A tab's content mounts on first selection and stays mounted afterwards, so switching away
 * and back doesn't refetch. `keepMounted` additionally renders it before it's ever selected.
 *
 * Storybook runs stories inside a `MemoryRouter`, but the hash read/write goes through
 * `window.history` — so the address bar updates as you switch tabs.
 */
const meta = {
  title: "Components/TabLayout",
  component: TabLayout,
  tags: ["autodocs"],
} satisfies Meta<typeof TabLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TabLayout>
      <Tab title="Line items" value="line-items">
        <Typography>12 line items across 3 surfaces.</Typography>
      </Tab>
      <Tab title="Placements" value="placements">
        <Typography>48 placements.</Typography>
      </Tab>
      <Tab title="Reconciliation" value="reconciliation">
        <Typography>Nothing to reconcile.</Typography>
      </Tab>
    </TabLayout>
  ),
}

export const TwoTabs: Story = {
  render: () => (
    <TabLayout>
      <Tab title="Overview" value="overview">
        <Typography>Overview content.</Typography>
      </Tab>
      <Tab title="Settings" value="settings">
        <Typography>Settings content.</Typography>
      </Tab>
    </TabLayout>
  ),
}

/** `keepMounted` renders a panel before it's first selected — for content that must not remount. */
export const KeepMounted: Story = {
  render: () => (
    <TabLayout>
      <Tab title="First" value="first">
        <Typography>Mounted on selection, as usual.</Typography>
      </Tab>
      <Tab keepMounted title="Kept mounted" value="kept">
        <Typography>Rendered even before you open this tab.</Typography>
      </Tab>
    </TabLayout>
  ),
}

export const ManyTabs: Story = {
  render: () => (
    <TabLayout>
      <Tab title="Advertisers" value="advertisers"><Typography>Advertisers</Typography></Tab>
      <Tab title="Agencies" value="agencies"><Typography>Agencies</Typography></Tab>
      <Tab title="Products" value="products"><Typography>Products</Typography></Tab>
      <Tab title="Ad units" value="ad-units"><Typography>Ad units</Typography></Tab>
      <Tab title="Pages" value="pages"><Typography>Pages</Typography></Tab>
      <Tab title="Surfaces" value="surfaces"><Typography>Surfaces</Typography></Tab>
    </TabLayout>
  ),
}

/** Non-`Tab` children are filtered out rather than rendered in the tab strip. */
export const IgnoresNonTabChildren: Story = {
  render: () => (
    <TabLayout>
      <Tab title="Only tab" value="only">
        <Typography>The sibling `div` below is not rendered.</Typography>
      </Tab>
      <div>Ignored</div>
    </TabLayout>
  ),
}
