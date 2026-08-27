import { FormatAlignCenter, FormatAlignLeft, FormatAlignRight, TableChart, ViewModule } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { ToggleButton, ToggleButtonGroup } from "./ToggleButton"

/** Both are straight pass-throughs to MUI, re-exported so apps import from one place. */
const meta = {
  title: "Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  args: {
    children: "Grid",
    value: "grid",
  },
} satisfies Meta<typeof ToggleButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    selected: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

/** Single selection — the common case for a view switcher. */
export const Group: Story = {
  render: () => {
    const [view, setView] = useState<string | null>("grid")

    return (
      <ToggleButtonGroup
        exclusive
        value={view}
        onChange={(_event, next: string | null) => setView(next)}
      >
        <ToggleButton value="grid"><ViewModule /></ToggleButton>
        <ToggleButton value="table"><TableChart /></ToggleButton>
      </ToggleButtonGroup>
    )
  },
}

/** Multiple selection — omit `exclusive` and the value becomes an array. */
export const GroupMultiple: Story = {
  render: () => {
    const [alignments, setAlignments] = useState<string[]>(["left"])

    return (
      <ToggleButtonGroup
        value={alignments}
        onChange={(_event, next: string[]) => setAlignments(next)}
      >
        <ToggleButton value="left"><FormatAlignLeft /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenter /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRight /></ToggleButton>
      </ToggleButtonGroup>
    )
  },
}

export const GroupVertical: Story = {
  render: () => {
    const [view, setView] = useState<string | null>("grid")

    return (
      <ToggleButtonGroup
        exclusive
        orientation="vertical"
        value={view}
        onChange={(_event, next: string | null) => setView(next)}
      >
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="table">Table</ToggleButton>
        <ToggleButton value="chart">Chart</ToggleButton>
      </ToggleButtonGroup>
    )
  },
}
