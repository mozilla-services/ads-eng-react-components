import type { Meta, StoryObj } from "@storybook/react-vite"

import { CircularProgress, LinearProgress } from "./Progress"
import { Box, Stack, Typography } from "../Layout/Layout"

/**
 * `CircularProgress` defaults to `color="inherit"` so it picks up the surrounding text
 * color — that's what lets it sit inside a `Button` or a `Backdrop` without extra props.
 * `LinearProgress` is a pass-through to MUI.
 */
const meta = {
  title: "Components/Progress",
  component: CircularProgress,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "text",
      description: "Any CSS length, e.g. `\"1em\"` to match the current font size.",
    },
  },
} satisfies Meta<typeof CircularProgress>

export default meta

type Story = StoryObj<typeof meta>

export const Circular: Story = {}

export const CircularSizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <CircularProgress size="1em" />
      <CircularProgress size="1.5rem" />
      <CircularProgress size={40} />
    </Stack>
  ),
}

/** `color="inherit"` means it takes the color of whatever contains it. */
export const CircularInheritsColor: Story = {
  render: () => (
    <Stack direction="row" spacing={3}>
      <Typography color="primary"><CircularProgress size="1.5rem" /></Typography>
      <Typography color="error"><CircularProgress size="1.5rem" /></Typography>
      <Typography color="success.main"><CircularProgress size="1.5rem" /></Typography>
    </Stack>
  ),
}

export const CircularDeterminate: Story = {
  args: {
    variant: "determinate",
    value: 65,
  },
}

export const Linear: Story = {
  render: () => (
    <Box sx={{ width: 320 }}>
      <LinearProgress />
    </Box>
  ),
}

export const LinearDeterminate: Story = {
  render: () => (
    <Box sx={{ width: 320 }}>
      <LinearProgress value={40} variant="determinate" />
    </Box>
  ),
}

export const LinearBuffer: Story = {
  render: () => (
    <Box sx={{ width: 320 }}>
      <LinearProgress value={40} valueBuffer={70} variant="buffer" />
    </Box>
  ),
}
