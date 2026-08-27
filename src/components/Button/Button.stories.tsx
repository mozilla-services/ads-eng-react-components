import { Add, Delete, Refresh, Search } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  AsyncButton,
  Button,
  ClipboardButton,
  DialogButton,
  PopoverButton,
  RemoteButton,
} from "./Button"
import { Stack, Typography } from "../Layout/Layout"
import { TextField } from "../InputField/InputField"
import { sleep } from "../../utils/async"

/**
 * `Button` wraps MUI's with tighter padding, no text transform, and a `Tooltip` that always
 * wraps a `<span />` — MUI tooltips can't attach to a disabled button directly, so the span
 * keeps the tooltip working in the disabled state too.
 *
 * An `href` starting with `/` or `#` is routed through React Router rather than causing a
 * page load; anything else falls through to the browser.
 */
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Save",
    variant: "contained",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["text", "outlined", "contained"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "error", "info", "success", "warning", "inherit"],
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: args => (
    <Stack direction="row" spacing={1}>
      <Button {...args} variant="text">Text</Button>
      <Button {...args} variant="outlined">Outlined</Button>
      <Button {...args} variant="contained">Contained</Button>
    </Stack>
  ),
}

export const WithTooltip: Story = {
  args: {
    tooltipTitle: "Saves and closes the form",
  },
}

/** The tooltip still works while disabled, because it wraps a `<span />` rather than the button. */
export const DisabledWithTooltip: Story = {
  args: {
    disabled: true,
    tooltipTitle: "Fill in every required field first",
  },
}

export const WithStartIcon: Story = {
  args: {
    children: "New line item",
    startIcon: <Add />,
  },
}

/**
 * With no children the button switches to icon-only layout: negative icon margins tighten
 * it to a square, and `tooltipTitle` doubles as the `aria-label`.
 */
export const IconOnly: Story = {
  args: {
    children: undefined,
    startIcon: <Search />,
    tooltipTitle: "Search",
  },
}

export const Circular: Story = {
  args: {
    children: undefined,
    circular: true,
    startIcon: <Refresh />,
    tooltipTitle: "Refresh",
    variant: "outlined",
  },
}

/** `AsyncButton` tracks its own pending/success/failure state from the promise `onClick` returns. */
export const Async: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <AsyncButton
        variant="contained"
        onClick={async () => {
          await sleep(1200)
          return "Synced 12 placements"
        }}
      >
        Succeeds
      </AsyncButton>
      <AsyncButton
        variant="contained"
        onClick={async () => {
          await sleep(1200)
          throw new Error("Equativ returned 502")
        }}
      >
        Fails
      </AsyncButton>
    </Stack>
  ),
}

/**
 * A resolved string becomes the tooltip, so the button reports its own result. Hover after
 * clicking. On failure the error message is surfaced the same way.
 */
export const AsyncReportsResultInTooltip: Story = {
  render: () => (
    <AsyncButton
      tooltipTitle="Click, then hover to see the result"
      variant="contained"
      onClick={async () => {
        await sleep(800)
        return "Queued 3 jobs"
      }}
    >
      Sync
    </AsyncButton>
  ),
}

/** `suppressStatusColor` / `suppressStatusIcon` opt out of the status affordances. */
export const AsyncWithoutStatusAffordances: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <AsyncButton suppressStatusIcon variant="contained" onClick={() => sleep(1000)}>No icon</AsyncButton>
      <AsyncButton suppressStatusColor variant="contained" onClick={() => sleep(1000)}>No color</AsyncButton>
    </Stack>
  ),
}

/** `confirmContent` gates the action behind a confirmation dialog. */
export const AsyncWithConfirmation: Story = {
  render: () => (
    <AsyncButton
      color="error"
      confirmContent="Deleting this line item can't be undone."
      confirmTitle="Delete line item?"
      startIcon={<Delete />}
      variant="contained"
      onClick={() => sleep(800)}
    >
      Delete
    </AsyncButton>
  ),
}

/**
 * `RemoteButton` issues the request itself through the shared `axios` instance and derives
 * its message from the response body.
 *
 * There's no API behind Storybook, so this lands in the failure state — which is the point:
 * it shows how a rejected request surfaces. See `Async` for the success path.
 */
export const Remote: Story = {
  render: () => (
    <Stack spacing={1}>
      <RemoteButton method="POST" url="/api/does-not-exist/" variant="contained">
        Sync to Equativ
      </RemoteButton>
      <Typography variant="caption">Clicking fails — Storybook serves no API.</Typography>
    </Stack>
  ),
}

/** Copies `data` to the clipboard and swaps the tooltip to confirm. */
export const Clipboard: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <ClipboardButton data="LI-88213" variant="outlined">Copy ID</ClipboardButton>
      <ClipboardButton copiedTooltipTitle="Copied the URL" data="https://example.com/adops/line-items/88213" variant="outlined">
        Copy link
      </ClipboardButton>
      <ClipboardButton data={null} tooltipTitle="Nothing to copy" variant="outlined">Empty</ClipboardButton>
    </Stack>
  ),
}

/** `DialogButton` pairs a button with a `Dialog` and opens it on click. */
export const Dialog: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <DialogButton title="Edit advertiser" variant="contained">
        <TextField defaultValue="Mozilla" label="Common name" />
      </DialogButton>
      <DialogButton
        dialogProps={{ primaryButtonTitle: "Archive", closeButtonTitle: "Keep" }}
        title="Archive campaign"
        variant="outlined"
      >
        This hides the campaign from the default view.
      </DialogButton>
    </Stack>
  ),
}

/** `PopoverButton` does the same for a `Popover`, anchored to the button. */
export const Popover: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <PopoverButton title="Filters" variant="outlined">
        <TextField label="Advertiser" size="small" />
        <TextField label="Placement" size="small" />
      </PopoverButton>
      <PopoverButton
        popoverProps={{ minWidth: "260px" }}
        title="Details"
        variant="outlined"
      >
        <Typography variant="body2">Anchored to the button, closes on outside click.</Typography>
      </PopoverButton>
    </Stack>
  ),
}
