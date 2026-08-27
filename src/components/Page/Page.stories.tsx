import type { Meta, StoryObj } from "@storybook/react-vite"

import { EmbeddedPage, Page } from "./Page"
import { PageProvider } from "../../providers/PageProvider"
import { usePage } from "../../hooks/usePage"
import { Box, Header, Paper, Typography } from "../Layout/Layout"

/**
 * `Page` does two things: it sets the document title to `"{title}"` via Helmet, and
 * it publishes `{ title, showSearch }` into `PageContext` so the app shell can render a
 * matching header and toggle its search field.
 *
 * Without a `PageProvider` the context write is a no-op against the default value, so `Page`
 * is safe to render standalone — these stories wrap it in one only to make the published
 * state visible.
 */
const meta = {
  title: "Components/Page",
  component: Page,
  tags: ["autodocs"],
  args: {
    title: "Campaign Management",
  },
  decorators: [
    Story => <PageProvider><Story /></PageProvider>,
  ],
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

/** Shows what `Page` pushed into `PageContext` — the app shell reads exactly this. */
const PageStateReadout = () => {
  const [pageState] = usePage()

  return (
    <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
      <Typography variant="subtitle2">PageContext</Typography>
      <Typography component="pre" sx={{ m: 0 }} variant="caption">
        {JSON.stringify(pageState, null, 2)}
      </Typography>
    </Paper>
  )
}

export const Default: Story = {
  render: args => (
    <Page {...args}>
      <Header title={args.title} />
      <Typography>{`Check the browser tab — the title is now "${args.title}".`}</Typography>
      <PageStateReadout />
    </Page>
  ),
}

/** `showSearch` is a request to the app shell, not something `Page` renders itself. */
export const WithSearch: Story = {
  args: {
    showSearch: true,
    title: "Line Items",
  },
  render: args => (
    <Page {...args}>
      <Header title={args.title} />
      <Typography>The shell decides how to honor `showSearch`.</Typography>
      <PageStateReadout />
    </Page>
  ),
}

/** With no `title` the document title is just `""`. */
export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
  render: args => (
    <Page {...args}>
      <Typography>{"Document title is \"\"."}</Typography>
      <PageStateReadout />
    </Page>
  ),
}

/**
 * `EmbeddedPage` is a `Page` whose body is an iframe pointed at `href`. The iframe stays
 * hidden behind a centered spinner until it loads, and stays hidden if it errors.
 *
 * External sites commonly refuse framing, so this may sit on the spinner or show a blank
 * frame — that's the remote site's `X-Frame-Options`, not the component.
 */
export const Embedded: Story = {
  render: () => (
    <Box sx={{ height: "24rem" }}>
      <EmbeddedPage href="https://example.com" title="Looker Dashboard" />
    </Box>
  ),
}

/** An unreachable `href` leaves the frame hidden — the failure state. */
export const EmbeddedFailure: Story = {
  render: () => (
    <Box sx={{ height: "16rem" }}>
      <EmbeddedPage href="/does-not-exist" title="Missing Dashboard" />
    </Box>
  ),
}
