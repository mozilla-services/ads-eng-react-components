import type { Meta, StoryObj } from "@storybook/react-vite"

import { Tooltip } from "./Tooltip"
import { Box, Stack } from "../Layout/Layout"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    title: "Synced 4 minutes ago",
    children: <Box component="span" sx={{ textDecoration: "underline dotted" }}>Hover me</Box>,
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right", "top-start", "top-end", "bottom-start", "bottom-end"],
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithArrow: Story = {
  args: {
    arrow: true,
  },
}

export const Placements: Story = {
  render: args => (
    <Stack direction="row" spacing={4} sx={{ p: 6 }}>
      <Tooltip {...args} arrow placement="top" title="Top"><span>Top</span></Tooltip>
      <Tooltip {...args} arrow placement="right" title="Right"><span>Right</span></Tooltip>
      <Tooltip {...args} arrow placement="bottom" title="Bottom"><span>Bottom</span></Tooltip>
      <Tooltip {...args} arrow placement="left" title="Left"><span>Left</span></Tooltip>
    </Stack>
  ),
}

/** An empty or absent `title` renders the child with no tooltip at all. */
export const NoTitle: Story = {
  args: {
    title: "",
  },
}

export const AlwaysOpen: Story = {
  args: {
    arrow: true,
    open: true,
  },
  decorators: [
    Story => <Box sx={{ pt: 6 }}><Story /></Box>,
  ],
}
