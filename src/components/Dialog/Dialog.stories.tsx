import type { Meta, StoryObj } from "@storybook/react-vite"
import { useRef } from "react"

import { Dialog, DialogHandle, DialogProps } from "./Dialog"
import { Button } from "../Button/Button"
import { TextField } from "../InputField/InputField"
import { Typography } from "../Layout/Layout"
import { sleep } from "../../utils/async"

/**
 * `Dialog` is opened imperatively through its ref (`ref.current.open()`) rather than by an
 * `open` prop — see `DialogButton` for the version that pairs it with its own trigger.
 *
 * `onAction` receives `"primary"` or `"close"` and may return a promise; while it's pending
 * both footer buttons are disabled and the active one shows a spinner. The dialog closes when
 * the promise resolves. If it rejects, the dialog **stays open** so the user can fix the
 * input — unless `closeOnError` is set.
 */
const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  args: {
    title: "Edit advertiser",
    children: <TextField defaultValue="Mozilla" label="Common name" />,
  },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

/** Every story renders a trigger, since the dialog has no visible surface until opened. */
const Trigger = ({ label = "Open dialog", ...props }: DialogProps & { label?: string }) => {
  const ref = useRef<DialogHandle>(null)

  return (
    <>
      <Button variant="contained" onClick={() => ref.current?.open()}>{label}</Button>
      <Dialog ref={ref} {...props} />
    </>
  )
}

export const Default: Story = {
  render: args => <Trigger {...args} />,
}

export const CustomButtonTitles: Story = {
  render: args => (
    <Trigger
      {...args}
      closeButtonTitle="Keep editing"
      label="Archive campaign"
      primaryButtonTitle="Archive"
      title="Archive campaign?"
    >
      <Typography>This hides the campaign from the default view.</Typography>
    </Trigger>
  ),
}

/** A slow `onAction` disables both buttons and spins the one that was pressed. */
export const PendingAction: Story = {
  render: args => (
    <Trigger
      {...args}
      label="Open (slow save)"
      onAction={async () => {
        await sleep(1500)
      }}
    />
  ),
}

/**
 * A rejected `onAction` keeps the dialog open — the default, so a validation failure doesn't
 * discard what the user typed.
 */
export const StaysOpenOnError: Story = {
  render: args => (
    <Trigger
      {...args}
      label="Open (save fails)"
      title="Save fails, dialog stays open"
      onAction={async () => {
        await sleep(800)
        throw new Error("Validation failed")
      }}
    />
  ),
}

/** `closeOnError` opts into closing anyway. */
export const ClosesOnError: Story = {
  render: args => (
    <Trigger
      {...args}
      closeOnError
      label="Open (closes on error)"
      title="Save fails, dialog closes"
      onAction={async () => {
        await sleep(800)
        throw new Error("Validation failed")
      }}
    />
  ),
}

export const FullWidth: Story = {
  render: args => <Trigger {...args} fullWidth label="Open full width" />,
}

export const FullHeight: Story = {
  render: args => <Trigger {...args} fullHeight fullWidth label="Open full height" />,
}

/** Confirmation shape: no primary button, so the only action is dismissal. */
export const CloseOnly: Story = {
  render: args => (
    <Trigger {...args} closeButtonTitle="Got it" label="Open notice" suppressPrimaryButton title="Sync complete">
      <Typography>12 placements were updated.</Typography>
    </Trigger>
  ),
}

/** Destructive shape: no dismiss button, forcing an explicit choice via the primary action. */
export const PrimaryOnly: Story = {
  render: args => (
    <Trigger {...args} label="Open acknowledgement" primaryButtonTitle="Acknowledge" suppressCloseButton title="Action required">
      <Typography>You must acknowledge before continuing.</Typography>
    </Trigger>
  ),
}

export const LongContent: Story = {
  render: args => (
    <Trigger {...args} fullWidth label="Open long content" title="Change log">
      {Array.from({ length: 20 }, (_item, index) => (
        <Typography key={index}>{`Revision ${index + 1} — updated the impressions goal.`}</Typography>
      ))}
    </Trigger>
  ),
}
