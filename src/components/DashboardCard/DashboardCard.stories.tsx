import type { Meta, StoryObj } from "@storybook/react-vite"

import { DashboardCard } from "./DashboardCard"
import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "../Layout/Layout"

/**
 * A grid cell for dashboard panels. It's a `Grid` item (default `{ xs: 12, md: 6 }`) wrapping
 * an outlined card with an ellipsizing title bar.
 *
 * - `flippable` uses the **first two children** as front and back, rotating between them.
 * - `maximizable` pins the card to the viewport below a 64px app bar.
 * - `href` makes the whole card a link, routed through React Router for in-app paths.
 *
 * `CardBody` forces its child to at least 300px tall, which is why the placeholders below
 * fill more space than their content needs.
 */
const meta = {
  title: "Components/DashboardCard",
  component: DashboardCard,
  tags: ["autodocs"],
  args: {
    title: "Impressions by surface",
  },
  decorators: [
    Story => <Grid container spacing={2}><Story /></Grid>,
  ],
} satisfies Meta<typeof DashboardCard>

export default meta

type Story = StoryObj<typeof meta>

const Placeholder = ({ label }: { label: string }) => (
  <div style={{
    alignItems: "center",
    background: "var(--mui-palette-action-hover)",
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
  }}
  >
    <Typography color="text.secondary" variant="body2">{label}</Typography>
  </div>
)

const SampleTable = () => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Surface</TableCell>
        <TableCell align="right">Impressions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>New Tab</TableCell>
        <TableCell align="right">1,204,882</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Homepage</TableCell>
        <TableCell align="right">402,110</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Search</TableCell>
        <TableCell align="right">88,201</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

export const Default: Story = {
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Chart goes here" />
    </DashboardCard>
  ),
}

/** Two cards at the default `md=6`, which is how the dashboard lays them out. */
export const Pair: Story = {
  render: args => (
    <>
      <DashboardCard {...args} title="Impressions by surface">
        <Placeholder label="Chart" />
      </DashboardCard>
      <DashboardCard {...args} title="Revenue by advertiser">
        <Placeholder label="Chart" />
      </DashboardCard>
    </>
  ),
}

export const FullWidth: Story = {
  args: {
    size: { xs: 12, md: 12 },
  },
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Full-width chart" />
    </DashboardCard>
  ),
}

/** The first child is the front, the second the back. Use the flip button in the title bar. */
export const Flippable: Story = {
  args: {
    flippable: true,
  },
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Front: visualization" />
      <SampleTable />
    </DashboardCard>
  ),
}

export const Maximizable: Story = {
  args: {
    maximizable: true,
  },
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Use the expand button in the title bar" />
    </DashboardCard>
  ),
}

export const FlippableAndMaximizable: Story = {
  args: {
    flippable: true,
    maximizable: true,
  },
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Front" />
      <SampleTable />
    </DashboardCard>
  ),
}

/** With `href` the card becomes one big link. */
export const Linked: Story = {
  args: {
    href: "/campaigns/1",
    title: "Q1 Brand — click through",
  },
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Whole card is clickable" />
    </DashboardCard>
  ),
}

/** Titles ellipsize rather than wrap, and the full text becomes the `title` attribute. */
export const LongTitle: Story = {
  args: {
    title: "A dashboard card title long enough that it has to ellipsize instead of wrapping onto a second line",
  },
  render: args => (
    <DashboardCard {...args}>
      <Placeholder label="Chart" />
    </DashboardCard>
  ),
}
