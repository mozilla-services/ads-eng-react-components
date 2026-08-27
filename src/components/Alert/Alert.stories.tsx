import { Close } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Alert } from "./Alert"
import { Button } from "../Button/Button"

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    children: "Line item synced to Equativ.",
    severity: "info",
  },
  argTypes: {
    severity: {
      control: "inline-radio",
      options: ["error", "warning", "info", "success"],
    },
    variant: {
      control: "inline-radio",
      options: ["standard", "filled", "outlined"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Severities: Story = {
  render: args => (
    <>
      <Alert {...args} severity="success">Campaign published.</Alert>
      <Alert {...args} severity="info">Sync runs every 15 minutes.</Alert>
      <Alert {...args} severity="warning">Two placements have no rate.</Alert>
      <Alert {...args} severity="error">Equativ rejected the request.</Alert>
    </>
  ),
}

export const Outlined: Story = {
  args: {
    variant: "outlined",
    severity: "warning",
    children: "This advertiser has no Boostr account linked.",
  },
}

export const Filled: Story = {
  args: {
    variant: "filled",
    severity: "error",
    children: "Failed to load line items.",
  },
}

/**
 * The wrapper adds `pt: 1px` to the action slot so a trailing button lines up with the
 * message text — that offset is the only thing this component adds over MUI's `Alert`.
 */
export const WithAction: Story = {
  args: {
    severity: "warning",
    children: "Draft campaign has unsaved changes.",
    action: <Button size="small" tooltipTitle="Dismiss"><Close fontSize="small" /></Button>,
  },
}

export const WithTitle: Story = {
  args: {
    severity: "error",
    children: (
      <>
        <strong>Sync failed</strong>
        <div>Equativ returned 502 for 3 of 12 placements.</div>
      </>
    ),
  },
}
