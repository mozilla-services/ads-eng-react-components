import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import {
  CheckboxField,
  DateField,
  EmailField,
  NumberField,
  SelectField,
  TextField,
} from "./InputField"
import { Stack } from "../Layout/Layout"

/**
 * Every text-ish field funnels through `TextField`, which pins `variant="outlined"` and a
 * shrunk label so labels never overlap a value. `DateField`, `EmailField` and `NumberField`
 * are the same component with `type` preset.
 *
 * `SearchField` and `RemoteSelectField` are intentionally **not** here — they need the app's
 * `SearchProvider` and `api/fetch`, so they stayed in ad-ops-dashboard.
 */
const meta = {
  title: "Components/InputField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    label: "Common name",
    name: "common_name",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "medium"],
    },
  },
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Text: Story = {}

export const TextWithValue: Story = {
  args: {
    defaultValue: "Mozilla",
  },
}

export const TextWithHelperText: Story = {
  args: {
    helperText: "Shown to advertisers in reports.",
  },
}

export const TextWithError: Story = {
  args: {
    defaultValue: "",
    error: true,
    helperText: "Common name is required.",
    required: true,
  },
}

export const TextDisabled: Story = {
  args: {
    defaultValue: "Mozilla",
    disabled: true,
  },
}

export const TextMultiline: Story = {
  args: {
    label: "Notes",
    multiline: true,
    rows: 3,
  },
}

export const Sizes: Story = {
  render: args => (
    <Stack spacing={2}>
      <TextField {...args} label="Small" size="small" />
      <TextField {...args} label="Medium" size="medium" />
    </Stack>
  ),
}

/** The typed variants, side by side. */
export const Types: Story = {
  render: () => (
    <Stack spacing={2}>
      <DateField defaultValue="2026-03-01" label="Flight start" name="start_date" />
      <EmailField defaultValue="adops@example.com" label="Owner" name="owner" />
      <NumberField defaultValue={2500} label="Impressions goal" name="goal" />
    </Stack>
  ),
}

/**
 * `CheckboxField` lays the label, checkbox and helper text out in a row and drives `checked`
 * from `value` — so it accepts the same `value` prop as the text fields rather than MUI's
 * `checked`.
 */
export const Checkbox: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true)

    return (
      <Stack spacing={2}>
        <CheckboxField
          label="Active"
          value={enabled}
          onChange={event => setEnabled(event.target.checked)}
        />
        <CheckboxField helperText="Required before publishing" label="Reviewed" value={false} />
        <CheckboxField error helperText="You must accept the terms" label="Terms" value={false} />
      </Stack>
    )
  },
}

/**
 * `SelectField` is an autocomplete over `selectParams.options`. It reports changes through a
 * synthesized `{ target: { name, value } }` event so it drops into the same form handler as
 * the text fields.
 */
export const Select: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>("newtab")

    return (
      <SelectField
        label="Surface"
        name="surface"
        selectParams={{
          options: [
            { label: "New Tab", value: "newtab" },
            { label: "Homepage", value: "homepage" },
            { label: "Search", value: "search" },
          ],
        }}
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    )
  },
}

export const SelectEmpty: Story = {
  render: () => (
    <SelectField label="Surface" name="surface" selectParams={{ options: [] }} />
  ),
}

export const SelectStates: Story = {
  render: () => {
    const options = [
      { label: "New Tab", value: "newtab" },
      { label: "Homepage", value: "homepage" },
    ]

    return (
      <Stack spacing={2}>
        <SelectField label="Disabled" name="a" selectParams={{ options }} disabled value="newtab" />
        <SelectField error helperText="Pick a surface" label="Error" name="b" required selectParams={{ options }} />
        <SelectField label="Small" name="c" selectParams={{ options }} size="small" />
      </Stack>
    )
  },
}

/** A representative form, to check the fields line up together. */
export const InAForm: Story = {
  render: () => (
    <Stack spacing={2} sx={{ maxWidth: 420 }}>
      <TextField defaultValue="Mozilla · Q1 Brand" label="Campaign name" name="name" />
      <SelectField
        label="Advertiser"
        name="advertiser"
        selectParams={{ options: [{ label: "Mozilla", value: 1 }, { label: "Thunderbird", value: 2 }] }}
        value={1}
      />
      <DateField defaultValue="2026-01-01" label="Start" name="start" />
      <DateField defaultValue="2026-03-31" label="End" name="end" />
      <NumberField defaultValue={1000000} label="Impressions" name="impressions" />
      <CheckboxField label="Active" value={true} />
    </Stack>
  ),
}
