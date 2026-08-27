import { Mail } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "./Badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    badgeContent: 4,
    children: <Mail />,
  },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "error", "info", "success", "warning"],
    },
    variant: {
      control: "inline-radio",
      options: ["standard", "dot"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dot: Story = {
  args: {
    variant: "dot",
  },
}

export const Error: Story = {
  args: {
    color: "error",
    badgeContent: 99,
  },
}

export const Overflow: Story = {
  args: {
    badgeContent: 1000,
    max: 999,
  },
}
