import type { Meta, StoryObj } from "@storybook/react-vite"

import { AppLoader } from "./AppLoader"

/**
 * The full-screen loading state shown while the app shell boots. It takes no props — it's a
 * `Backdrop` at the drawer z-index with a `CircularProgress` inside, so it covers whatever
 * is behind it and inherits the backdrop's white text color.
 */
const meta = {
  title: "Components/AppLoader",
  component: AppLoader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppLoader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Over page content, to show the backdrop dimming what's underneath. */
export const OverContent: Story = {
  render: () => (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Campaign Management</h1>
        <p>This content sits behind the loader.</p>
      </div>
      <AppLoader />
    </>
  ),
}
