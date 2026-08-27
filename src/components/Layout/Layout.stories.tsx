import { Refresh } from "@mui/icons-material"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import {
  Backdrop,
  Box,
  Divider,
  Grid,
  Header,
  Paper,
  SpacerBox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "./Layout"
import { Button } from "../Button/Button"
import { CircularProgress } from "../Progress/Progress"

/**
 * Thin re-exports of MUI's layout primitives, so app code imports from one place and the
 * `no-restricted-imports` lint rule can keep direct MUI imports out of feature code.
 *
 * Only three add behavior: `Backdrop` (white text at the drawer z-index), `SpacerBox`
 * (flex-grow filler) and `Header` (title row that right-aligns an accessory).
 */
const meta = {
  title: "Components/Layout",
  component: Box,
  tags: ["autodocs"],
} satisfies Meta<typeof Box>

export default meta

type Story = StoryObj<typeof meta>

const Swatch = ({ children }: React.PropsWithChildren) => (
  <Box sx={{ bgcolor: "action.hover", borderRadius: 1, p: 1 }}>{children}</Box>
)

export const Typographies: Story = {
  render: () => (
    <Stack spacing={1}>
      <Typography variant="h4">Campaign Management</Typography>
      <Typography variant="h6">Line items</Typography>
      <Typography variant="subtitle1">Mozilla · Q1 Brand</Typography>
      <Typography variant="body1">Flight runs 1 Jan – 31 Mar.</Typography>
      <Typography variant="body2" color="text.secondary">Last synced 4 minutes ago.</Typography>
      <Typography variant="caption">LI-88213</Typography>
    </Stack>
  ),
}

/** `Header` right-aligns `accessory` by inserting a `SpacerBox` between it and the title. */
export const Headers: Story = {
  render: () => (
    <Stack spacing={3}>
      <Header title="Line items" />
      <Header
        accessory={<Button startIcon={<Refresh />} tooltipTitle="Refresh" variant="outlined">Refresh</Button>}
        title="Line items"
      />
    </Stack>
  ),
}

/** `SpacerBox` grows to fill the free space in a flex row — the toolbar push-right idiom. */
export const Spacer: Story = {
  render: () => (
    <Stack direction="row" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1 }}>
      <Swatch>Left</Swatch>
      <SpacerBox />
      <Swatch>Right</Swatch>
    </Stack>
  ),
}

export const Stacks: Story = {
  render: () => (
    <Stack spacing={3}>
      <div>
        <Typography variant="subtitle2">Row</Typography>
        <Stack direction="row" spacing={1}>
          <Swatch>One</Swatch>
          <Swatch>Two</Swatch>
          <Swatch>Three</Swatch>
        </Stack>
      </div>
      <div>
        <Typography variant="subtitle2">Column</Typography>
        <Stack spacing={1}>
          <Swatch>One</Swatch>
          <Swatch>Two</Swatch>
        </Stack>
      </div>
      <div>
        <Typography variant="subtitle2">Divided</Typography>
        <Stack direction="row" divider={<Divider flexItem orientation="vertical" />} spacing={2}>
          <Swatch>One</Swatch>
          <Swatch>Two</Swatch>
        </Stack>
      </div>
    </Stack>
  ),
}

export const Grids: Story = {
  render: () => (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}><Swatch>xs=12 md=6</Swatch></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Swatch>xs=12 md=6</Swatch></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Swatch>xs=12 md=4</Swatch></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Swatch>xs=12 md=4</Swatch></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Swatch>xs=12 md=4</Swatch></Grid>
    </Grid>
  ),
}

export const Papers: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Paper sx={{ p: 2 }}>elevation (default)</Paper>
      <Paper sx={{ p: 2 }} variant="outlined">outlined</Paper>
      <Paper elevation={8} sx={{ p: 2 }}>elevation 8</Paper>
    </Stack>
  ),
}

export const Toolbars: Story = {
  render: () => (
    <Paper variant="outlined">
      <Toolbar>
        <Typography variant="h6">Placements</Typography>
        <SpacerBox />
        <Button variant="outlined">Export</Button>
      </Toolbar>
    </Paper>
  ),
}

export const Tables: Story = {
  render: () => (
    <Paper variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Line item</TableCell>
            <TableCell>Surface</TableCell>
            <TableCell align="right">Impressions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>LI-88213</TableCell>
            <TableCell>New Tab</TableCell>
            <TableCell align="right">1,204,882</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>LI-88214</TableCell>
            <TableCell>Homepage</TableCell>
            <TableCell align="right">402,110</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ),
}

export const Dividers: Story = {
  render: () => (
    <Stack spacing={2}>
      <Divider />
      <Divider>with a label</Divider>
      <Divider textAlign="left">left-aligned</Divider>
    </Stack>
  ),
}

/** `Backdrop` sits at the drawer z-index and sets white text, so an inheriting spinner shows up. */
export const Backdrops: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>Show backdrop</Button>
        <Backdrop open={open} onClick={() => setOpen(false)}>
          <CircularProgress />
        </Backdrop>
      </>
    )
  },
}
