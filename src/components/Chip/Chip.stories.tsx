import { Close, Edit, OpenInNew } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ActionChip, Chip } from "./Chip"
import { Stack } from "../Layout/Layout"

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    label: "mozilla.org",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "error", "info", "success", "warning"],
    },
    variant: {
      control: "inline-radio",
      options: ["filled", "outlined"],
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium"],
    },
  },
} satisfies Meta<typeof Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Colors: Story = {
  render: args => (
    <Stack direction="row" spacing={1}>
      <Chip {...args} color="default" label="Draft" />
      <Chip {...args} color="primary" label="Live" />
      <Chip {...args} color="success" label="Synced" />
      <Chip {...args} color="warning" label="Pending" />
      <Chip {...args} color="error" label="Failed" />
    </Stack>
  ),
}

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
}

export const Small: Story = {
  args: {
    size: "small",
  },
}

/**
 * `ActionChip` is the opinionated variant: it forces `size="small"` with a smaller font,
 * repurposes MUI's delete slot as a generic action, and wraps itself in a `Tooltip` when
 * `tooltipTitle` is set.
 */
export const Action: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <ActionChip actionIcon={Edit} label="Homepage" tooltipTitle="Edit tag value" onAction={() => {}} />
      <ActionChip actionIcon={OpenInNew} label="Newtab" tooltipTitle="Open in Equativ" onAction={() => {}} />
      <ActionChip actionIcon={Close} color="error" label="Deprecated" tooltipTitle="Remove" onAction={() => {}} />
    </Stack>
  ),
}

/** Without `onAction` or `onClick` there's no action icon and no tooltip — a plain small chip. */
export const ActionWithoutHandler: Story = {
  render: () => <ActionChip label="Read only" />,
}

/**
 * `onAction` takes precedence over `onClick`. When only `onClick` is given, activating the
 * action icon calls it instead — so a chip never ends up with a dead affordance.
 */
export const ActionFallsBackToOnClick: Story = {
  render: () => (
    <ActionChip
      actionIcon={Edit}
      label="Falls back to onClick"
      tooltipTitle="Calls onClick"
      onClick={() => {}}
    />
  ),
}
