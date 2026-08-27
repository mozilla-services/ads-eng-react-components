import type { Meta, StoryObj } from "@storybook/react-vite"
import { useRef } from "react"

import { Popover, PopoverHandle, PopoverProps } from "./Popover"
import { Button } from "../Button/Button"
import { TextField } from "../InputField/InputField"
import { Stack, Typography } from "../Layout/Layout"

/**
 * `Popover` is opened imperatively through its ref and anchored to whatever element
 * `anchorRef` points at — see `PopoverButton` for the version that owns its own trigger.
 *
 * Children are stacked vertically with spacing, so a stack of filter fields needs no extra
 * wrapper. Default origins put it centered below the anchor.
 */
const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  args: {
    // Placeholder so the required prop is satisfied for the docs table; every story supplies
    // a real ref through the `Trigger` wrapper below.
    anchorRef: { current: null },
    children: <Typography variant="body2">Anchored to the button.</Typography>,
  },
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

/** Each story needs a real anchor element, so the trigger owns the ref. */
const Trigger = ({ label = "Open popover", ...props }: Omit<PopoverProps, "anchorRef"> & { label?: string }) => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<PopoverHandle>(null)

  return (
    <>
      <Button ref={anchorRef} variant="outlined" onClick={() => popoverRef.current?.open()}>
        {label}
      </Button>
      <Popover ref={popoverRef} anchorRef={anchorRef} {...props} />
    </>
  )
}

export const Default: Story = {
  render: args => <Trigger {...args} />,
}

/** Children are stacked with spacing — a filter panel needs no wrapper element. */
export const WithFields: Story = {
  render: () => (
    <Trigger label="Filters" minWidth="260px">
      <TextField label="Advertiser" size="small" />
      <TextField label="Placement" size="small" />
      <Button variant="contained">Apply</Button>
    </Trigger>
  ),
}

export const MinWidth: Story = {
  render: args => <Trigger {...args} label="Wide popover" minWidth="360px" />,
}

export const CustomPadding: Story = {
  render: args => <Trigger {...args} label="Roomy popover" padding="24px" />,
}

export const CustomBackground: Story = {
  render: () => (
    <Trigger backgroundColor="#1976d2" label="Tinted popover">
      <Typography sx={{ color: "common.white" }} variant="body2">
        Custom background color.
      </Typography>
    </Trigger>
  ),
}

/** `anchorOrigin` / `transformOrigin` reposition it relative to the anchor. */
export const Placements: Story = {
  render: args => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      <Trigger
        {...args}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        label="Above"
        transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      />
      <Trigger {...args} label="Below (default)" />
      <Trigger
        {...args}
        anchorOrigin={{ horizontal: "right", vertical: "center" }}
        label="Right"
        transformOrigin={{ horizontal: "left", vertical: "center" }}
      />
    </Stack>
  ),
}

/** `onOpen` / `onClose` fire alongside the imperative calls. */
export const WithCallbacks: Story = {
  render: args => (
    <Trigger
      {...args}
      label="Logs open/close"
      onClose={() => console.info("popover closed")}
      onOpen={() => console.info("popover opened")}
    />
  ),
}
