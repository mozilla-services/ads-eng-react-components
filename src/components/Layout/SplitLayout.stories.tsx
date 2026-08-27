import type { Meta, StoryObj } from "@storybook/react-vite"

import { SplitLayout } from "./SplitLayout"
import { Box, Paper, Typography } from "./Layout"
import { List, ListItem } from "../List/List"

/**
 * A resizable two-pane split built on `react-resizable-panels`. It takes exactly two
 * children — **nav first, then main** — and `rightSideNav` flips which side the nav lands on
 * without reordering the JSX.
 *
 * Sizes ending in `px` (or numbers) keep their pixel width as the window resizes; percentage
 * and unitless-string sizes scale proportionally instead.
 */
const meta = {
  title: "Components/SplitLayout",
  component: SplitLayout,
  tags: ["autodocs"],
  args: {
    minHeight: "22rem",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SplitLayout>

export default meta

type Story = StoryObj<typeof meta>

const Nav = () => (
  <Paper variant="outlined" sx={{ height: "100%", overflow: "auto" }}>
    <List>
      <ListItem selected title="Mozilla" />
      <ListItem title="Thunderbird" />
      <ListItem title="Pocket" />
    </List>
  </Paper>
)

const Main = ({ label = "Main pane" }: { label?: string }) => (
  <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
    <Typography variant="h6">{label}</Typography>
    <Typography variant="body2" color="text.secondary">
      Drag the separator between the panes to resize.
    </Typography>
  </Paper>
)

export const Default: Story = {
  render: args => (
    <SplitLayout {...args}>
      <Nav />
      <Main />
    </SplitLayout>
  ),
}

/** Children stay in nav-then-main order; only the rendered position changes. */
export const RightSideNav: Story = {
  args: {
    rightSideNav: true,
  },
  render: args => (
    <SplitLayout {...args}>
      <Main label="Main pane (rendered left)" />
      <Nav />
    </SplitLayout>
  ),
}

/** `disableResizing` freezes the separator — same layout, no drag handle behavior. */
export const ResizingDisabled: Story = {
  args: {
    disableResizing: true,
  },
  render: args => (
    <SplitLayout {...args}>
      <Nav />
      <Main label="Fixed panes" />
    </SplitLayout>
  ),
}

/** Pixel sizes: the nav holds its width when the window resizes. */
export const PixelSizes: Story = {
  args: {
    navDefaultSize: 240,
    navMinSize: 160,
    navMaxSize: 420,
  },
  render: args => (
    <SplitLayout {...args}>
      <Nav />
      <Main label="Nav is 240px, clamped 160–420" />
    </SplitLayout>
  ),
}

/** Percentage sizes: both panes scale proportionally instead. */
export const ProportionalSizes: Story = {
  args: {
    navDefaultSize: "30%",
    mainDefaultSize: "70%",
  },
  render: args => (
    <SplitLayout {...args}>
      <Nav />
      <Main label="30% / 70%" />
    </SplitLayout>
  ),
}

export const Tall: Story = {
  args: {
    minHeight: "36rem",
  },
  render: args => (
    <SplitLayout {...args}>
      <Nav />
      <Box sx={{ height: "100%" }}><Main label="Taller container" /></Box>
    </SplitLayout>
  ),
}
