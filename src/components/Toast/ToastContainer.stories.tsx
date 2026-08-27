import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { ToastContainer } from "./ToastContainer"
import { Button } from "../Button/Button"
import { Stack, Typography } from "../Layout/Layout"

/**
 * The toast host. All it adds over react-toastify's container is wiring `theme` to the
 * current `ThemeMode` from `useTheme()`, so toasts follow the app's light/dark setting —
 * switch the theme in the toolbar and fire another toast to see it.
 *
 * **The CSS is not bundled.** This package doesn't import
 * `react-toastify/dist/ReactToastify.css` — that would force a stylesheet on every consumer
 * and break `sideEffects: false`. Import it once in your app entrypoint (ad-ops-dashboard
 * does so in `App.tsx`); these stories import it at the top of this file.
 */
const meta = {
  title: "Components/ToastContainer",
  component: ToastContainer,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top-right", "top-center", "top-left", "bottom-right", "bottom-center", "bottom-left"],
    },
  },
} satisfies Meta<typeof ToastContainer>

export default meta

type Story = StoryObj<typeof meta>

/** Nothing renders until a toast is queued, so each story needs a trigger. */
export const Default: Story = {
  render: args => (
    <>
      <Button variant="contained" onClick={() => toast("Synced 12 placements")}>Show toast</Button>
      <ToastContainer {...args} />
    </>
  ),
}

export const Severities: Story = {
  render: args => (
    <>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" onClick={() => toast.success("Campaign published")}>Success</Button>
        <Button variant="outlined" onClick={() => toast.info("Sync runs every 15 minutes")}>Info</Button>
        <Button variant="outlined" onClick={() => toast.warning("Two placements have no rate")}>Warning</Button>
        <Button variant="outlined" onClick={() => toast.error("Equativ returned 502")}>Error</Button>
      </Stack>
      <ToastContainer {...args} />
    </>
  ),
}

/** Switch the theme in the toolbar, then fire a toast — it follows `useTheme()`. */
export const FollowsTheme: Story = {
  render: args => (
    <>
      <Stack spacing={1}>
        <Button variant="contained" onClick={() => toast("Follows the toolbar theme")}>Show toast</Button>
        <Typography variant="caption">
          Change the theme in the Storybook toolbar and fire another toast.
        </Typography>
      </Stack>
      <ToastContainer {...args} />
    </>
  ),
}

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
  },
  render: args => (
    <>
      <Button variant="contained" onClick={() => toast("Bottom left")}>Show toast</Button>
      <ToastContainer {...args} />
    </>
  ),
}

export const StaysOpen: Story = {
  args: {
    autoClose: false,
    closeOnClick: true,
  },
  render: args => (
    <>
      <Button variant="contained" onClick={() => toast("Click me to dismiss")}>Show sticky toast</Button>
      <ToastContainer {...args} />
    </>
  ),
}

export const Stacked: Story = {
  render: args => (
    <>
      <Button
        variant="contained"
        onClick={() => {
          toast.success("Advertiser created")
          toast.info("Queued Equativ sync")
          toast.warning("Rate card is out of date")
        }}
      >
        Show three toasts
      </Button>
      <ToastContainer {...args} />
    </>
  ),
}
